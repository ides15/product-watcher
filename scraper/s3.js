const AWS = require("aws-sdk");

AWS.config.update({
  region: "us-east-1",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

const productsBucketName = "product-watcher-v2";

async function doesBucketExist() {
  const headParams = {
    Bucket: productsBucketName
  };

  try {
    await s3.headBucket(headParams).promise();
    return true;
  } catch (error) {
    return false;
  }
}

async function createBucket() {
  const bucketParams = {
    Bucket: productsBucketName,
    ACL: "public-read"
  };

  await s3.createBucket(bucketParams).promise();
}

async function doesProductExist(name) {
  const headParams = {
    Bucket: productsBucketName,
    Key: `${name}.json`
  };

  try {
    await s3.headObject(headParams).promise();
    return true;
  } catch (error) {
    return false;
  }
}

async function saveProduct(name, urls, history = []) {
  const uploadParams = {
    Bucket: productsBucketName,
    Key: `${name}.json`,
    Body: JSON.stringify({
      name,
      urls,
      history
    })
  };

  await s3.upload(uploadParams).promise();
}

async function getProduct(name) {
  const getParams = {
    Bucket: productsBucketName,
    Key: `${name}.json`
  };

  const product = await s3.getObject(getParams).promise();

  return JSON.parse(product.Body);
}

module.exports = {
  doesBucketExist,
  createBucket,
  doesProductExist,
  saveProduct,
  getProduct
};
