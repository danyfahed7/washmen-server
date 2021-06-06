FROM node:10 AS server-build
WORKDIR /usr/src/app
COPY api/ ./api/
RUN cd api && npm install && npm run build

FROM node:10
WORKDIR /usr/src/app/
COPY --from=server-build /usr/src/app/api/dist ./
COPY --from=server-build /usr/src/app/api/data ./data
RUN ls

EXPOSE 3080

CMD ["node", "./api.bundle.js"]