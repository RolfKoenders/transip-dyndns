# Transip-dyndns

Keeps a dns record on a [transip](http://www.transip.nl) domain up to date with the current WAN IP.

## Quick start

1. Configure the project
2. Run `npm install`
3. Run `node transip-dyndns`
4. Profit

## Configure

### JSON

Copy `config/config-example.json` to `config/config.json`.

Example config:

```
{
  "transip": {
    "login": "",            > Your transip username
    "privateKeyPath": ""    > Path to your transip private api key file
  },
  "domain": "",             > The name of your transip domain (example.com)
  "dnsRecord": "",          > The name of your transip dns record you want to update
  "logLocation": "./output.log"
}
```

### BASH

It's also possible to use environment variables.

```bash
# Required
TRANSIP_LOGIN=<transip-username>
TRANSIP_PRIVATE_KEY=<path to secrets file (~/.secrets/transip_private_key.key)>
TRANSIP_DOMAIN=<domain without protocol (example.nl)>
TRANSIP_DNS_RECORD=<name of the dns record to update>

# Optional
TRANSIP_LOG_LOCATION=<path to output log file> (default: ./output.log)
```

## Docker

This fork does **not** support the Docker image. Please see [RolfKoenders/transip-dyndns](https://github.com/RolfKoenders/transip-dyndns) if you want to use that.
