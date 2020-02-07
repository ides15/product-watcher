FROM node:12

COPY . .

ENV NODE_ENV=production

CMD ["node", "handler.js"]
