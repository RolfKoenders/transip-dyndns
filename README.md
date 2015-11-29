# Transip-dyndns
Keeps a dns record on a [transip](http://www.transip.nl) domain up to date with the current WAN IP.

## Configure :heavy_exclamation_mark:
In the root folder there is an `config-example.json` file. Save that file as `config.json` and that one will be used. This is the example config:

```json
{
  "transip": {
    "login": "",
    "privateKeyPath": ""
  },
  "domain": "",
  "dnsRecord": "",
  "logLocation": "./output.log"
}

```

Its also possible to use environment variables.

```bash
# Required
TRANSIP_LOGIN=<transip-username>
TRANSIP_PRIVATE_KEY=<path to secrets file (~/.secrets/transip_private_key.key)>
TRANSIP_DOMAIN=<domain without protocol (example.nl)>
TRANSIP_DNS_RECORD=<name of the dns record to update>

# Optional
TRANSIP_LOG_LOCATION=<path to output log file> (default: ./output.log)
```

## Docker :whale:
There is a docker image for the hipsters who want to run everything with docker.

```
docker pull rolfkoenders/transip-dyndns
```

### Run
To run the container we need to mount 2 volumes.
* Directory where the privateKey :key: can be found.
* Directory where the config file :page_facing_up: is stored.

```
docker run -t -v /home/<user>/.secrets/transip:/secrets -v /home/<user>/configurations/transip-config/:/config <namespace>/transip-dyndns
```

### Build
If you want to build the image yourself:
```
docker build -t <namespace>/transip-dyndns .
```
