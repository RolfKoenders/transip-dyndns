# TransIp Dynamic DNS
This repo is a fork from [transip-dyndns](https://github.com/RolfKoenders/transip-dyndns) but actually a complete refactor (including new config structure).
Keeps dns entries on [transip](http://www.transip.nl) for one or multiple domains up to date with the current WAN IP (or custom content). 

## Features :mega:
- Update multiple domains and  and their entries
- Interval (by default every 30m)
- Improved logging
- Docker support

## Configure :heavy_exclamation_mark:
In the data folder there is an example file call `config-example.json`. rename that file as `config.json` and configure it as below demonstrated. 

#### Example
```json
{
  "transip": {
    "login": "User",
    "privateKeyPath": "~/.secrets/private.key"
  },
  "domainsToCheck": {
      "domains": [
             {
               "domain": "example.net",
               "dnsEntries": [
                 {
                   "name": "@",
                   "type": "a"
                 },
                 {
                   "name": "prefix",
                   "type": "cname",
                   "content": "@"
                 }
               ]
             }
         ]
  },
  "logLevel": "info",
  "dnsCheckInterval": "30m"
}

```
Note: every dnsEntry needs to **contain** at least a **name and type**.

##### dnsEntry attributes
````

name { String } (required)
type { String } (required)
content { String } (optional)
expire { Number } (optional)

````
More info [here](https://www.npmjs.com/package/transip#transipinstancedomainservicesetdnsentries)

### Environment variables

Its also possible to use environment variables.

##### Required *(When no config file used)*
```
TRANSIP_LOGIN=username
TRANSIP_PRIVATE_KEY=~/.secrets/id_rsa.transip>
DOMAINS_TO_CHECK={ "domains": [ { "domain": "example.net", "dnsEntries": [ { "name": "@", "type": "AAAA", "content": "1.2.3.4" } ] } ] }
```

##### Optional
```
# Optional
WAN_CHECK_SERVICE_URL=https://api.ipify.org
DNS_CHECK_INTERVAL=5m
LOG_LOCATION=/log/output.log
LOG_LEVEL=debug
```

## NPM
You could also run it locally

```
git clone git@github.com:frankforpresident/transip-dynamic-dns.git
cd transip-dynamic-dns
npm install --prod
npm run start
```

## Docker :whale:
Also available as a [docker image](https://hub.docker.com/r/frankforpresident/transip-dynamic-dns/).

```
docker pull frankforpresident/transip-dynamic-dns
```

#### Run
To run the container we need to mount 2 volumes.
* Directory where the privateKey :key: can be found.
* Directory where the config file :page_facing_up: is stored.

```
docker run -t -v ~/.secrets/id_rsa.transip:/secrets/id_rsa.transip:ro -v ~/data:/data frankforpresident/transip-dynamic-dns
```

#### Compose

```
 dyndns:
    image: frankforpresident/transip-dynamic-dns
    container_name: "transip-dynamic-dns"
    restart: always
    volumes:
      - ~/data:/data
      - ~/.secrets/id_rsa.transip:/secrets/id_rsa.transip
```

#### Build
If you want to build the image yourself:
```
docker build -t <namespace>/transip-dynamic-dns .
```
