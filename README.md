# Transip-dyndns
Keeps a dns record on a [transip](http://www.transip.nl) domain up to date with the current WAN IP.

## Configure
The configuration is done through environment variables.

```bash
# Required
TRANSIP_LOGIN=<transip-username>
TRANSIP_PRIVATE_KEY=<path to secrets file (~/.secrets/transip_private_key.key)>
TRANSIP_DOMAIN=<domain without protocol (example.nl)>
TRANSIP_DNS_RECORD=<name of the dns record to update>

# Optional
TRANSIP_LOG_LOCATION=<path to output log file> (default: ./output.log)
```
