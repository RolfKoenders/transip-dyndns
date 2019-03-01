# TransIp DynDns 2.0
This repo is a fork from [transip-dyndns](https://github.com/RolfKoenders/transip-dyndns).
Keeps dns entries on [transip](http://www.transip.nl) for one or multiple domains up to date with the current WAN IP (or custom content). 

## Features
- Update multiple domains and  and their entries
- Interval (by default every 5m)
- Docker support

## Configure :heavy_exclamation_mark:
In the root folder there is an `config-example.json` file. Save that file as `config.json` and that one will be used. This is the example config:

#### Example
```json
{
  "transip": {
    "login": "User",
    "privateKeyPath": "~/.secrets/private.key"
  },
  "domains": [
       {
         "domain": "example.net",
         "dnsEntries": [
           {
             "name": "@",
             "type": "a",
           },
           {
             "name": "prefix",
             "type": "cname",
             "content": "@"
           }
         ]
       }
   ],
  "logLocation": "./data/output.log",
  "wanCheckURL": "http://icanhazip.com"
}

```

##### dnsEntry attributes
````json
{
    'name': 'record',
    'expire': 10800,
    'type': 'A',
    'content': 'XXX.XXX.XXX.XXX' 
}
````
Its also possible to use environment variables.

##### Required
```
TRANSIP_LOGIN=username
TRANSIP_PRIVATE_KEY=~/.ssh/id_rsa.transip>
TRANSIP_DOMAINS=[ { "domain": "example.net", "dnsEntries": [ { "name": "@" } ] } ]
```

##### Optional
```
# Optional
WAN_CHECK_SERVICE_URL=http://icanhazip.com
DNS_CHECK_INTERVAL=5m
TRANSIP_LOG_LOCATION=<path to output log file> (default: ./output.log)
```

## NPM
You could also run it locally

```
git clone git@github.com:frankforpresident/transip-dyndns.git
cd transip-dyndns
npm i
npm run start
```

## Docker :whale:
There is a [docker image](https://hub.docker.com/r/rolfkoenders/transip-dyndns/) for the hipsters who want to run everything with docker.

```
docker pull rolfkoenders/transip-dyndns
```

### Run
To run the container we need to mount 2 volumes.
* Directory where the privateKey :key: can be found.
* Directory where the config file :page_facing_up: is stored.

```
docker run -t -v ~/.secrets/id_rsa.transip:/secrets/id_rsa.transip:ro -v ~/data:/data frankforpresident/transip-dyndns
```

### Compose

```
 dyndns:
    image: frankforpresident/transip-dyndns
    container_name: "transip-dyndns"
    restart: always
    volumes:
      - ~/data:/data
      - ~/.secrets/id_rsa.transip:/secrets/id_rsa.transip
```

### Build
If you want to build the image yourself:
```
docker build -t <namespace>/transip-dyndns .
```
