FROM node:8
# ARG node_env

# Setup
WORKDIR /etc/notifier/
# RUN export NODE_ENV=$node_env

# Copy source code into container
ADD . /etc/notifier

# Install dependencies
RUN npm i

# Run http server 
CMD npm start 