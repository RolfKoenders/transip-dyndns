# Transip-dyndns
Keeps a dns record on a [transip](http://www.transip.nl) domain up to date with the current WAN IP.

## Configure
In the config folder there is an example config file. Save that file as `config.json` and that one will be used. This is the example config:

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
