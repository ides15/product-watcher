FROM node:12

COPY . .

RUN ["env"]

CMD ["node", "handler.js"]
