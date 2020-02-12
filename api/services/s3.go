package services

import (
	"encoding/json"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
)

const (
	defaultBucketName = "product-watcher-v2"
	defaultRegion     = "us-east-1"
)

type S3Client struct {
	s3         *s3.S3
	bucketName string
	region     string
}

type Product struct {
	Name    string   `json:"name"`
	URLs    []string `json:"urls"`
	History []*struct {
		Date  string  `json:"date"`
		URL   string  `json:"url"`
		Price float32 `json:"price"`
	} `json:"history"`
}

func NewS3Client() (*S3Client, error) {
	sess, err := session.NewSession(&aws.Config{
		Credentials: credentials.NewEnvCredentials(),
		Region:      aws.String(defaultRegion),
	})
	if err != nil {
		return nil, err
	}

	return &S3Client{
		s3:         s3.New(sess),
		bucketName: defaultBucketName,
		region:     defaultRegion,
	}, nil
}

func (c *S3Client) BucketExists() (bool, error) {
	_, err := c.s3.HeadBucket(&s3.HeadBucketInput{
		Bucket: aws.String(c.bucketName),
	})
	if err != nil {
		return false, nil
	}

	return true, nil
}

func (c *S3Client) ListObjects() ([]string, error) {
	objects, err := c.s3.ListObjects(&s3.ListObjectsInput{
		Bucket: aws.String(c.bucketName),
	})
	if err != nil {
		return nil, err
	}

	products := []string{}
	for _, object := range objects.Contents {
		products = append(products, *object.Key)
	}

	return products, nil
}

func (c *S3Client) GetProduct(name string) (*Product, error) {
	obj, err := c.s3.GetObject(&s3.GetObjectInput{
		Bucket: aws.String(c.bucketName),
		Key:    aws.String(name + ".json"),
	})
	if err != nil {
		return nil, err
	}
	defer obj.Body.Close()

	product := &Product{}
	if err = json.NewDecoder(obj.Body).Decode(product); err != nil {
		return nil, err
	}

	return product, nil
}
