import requests
import json
import transip
import schedule
import time


def getConfig(configPath):
    rawConfig = open(configPath, "r").read()
    return json.loads(rawConfig)


def getTransIpClient(login, privateKeyPath):
    # You can initialize a TransIP client using a private key directly.
    PRIVATE_KEY = open(privateKeyPath, "r").read()
    return transip.TransIP(login, private_key=PRIVATE_KEY)


def getWanIp(url):
    r = requests.get(url)
    return r.text.strip()


def transipDDNS():
    config = getConfig("data/config.json")

    wanIp = getWanIp(config["wanCheckURL"])

    print(f"WAN: {wanIp}")

    client = getTransIpClient(
        config["transip"]["login"], config["transip"]["privateKeyPath"]
    )

    domainsToCheck = config["domainsToCheck"]["domains"]
    for domainToCheck in domainsToCheck:

        domain = client.domains.get(domainToCheck["domain"])

        print(
            f"Domain {domain.name} was registered at {domain.registrationDate}")
        # Retrieve a domain by its name.
        domainInfo = client.domains.get(domain.name)
        # Retrieve the DNS records of a single domain.
        records = domainInfo.dns.list()

        for dnsEntry in domainToCheck["dnsEntries"]:

            # Show the DNS record information on the screen.
            for record in records:
                if (record.name == dnsEntry["name"] and record.type == dnsEntry["type"]):
                    print(
                        f"DNS entry: {record.name} {record.expire} {record.type} {record.content}"
                    )

                    if (record.content != wanIp):

                        # Dictionary containing the information for a single updated DNS record.
                        dns_entry_data = {
                            "name": record.name,
                            "expire": record.expire,
                            "type": record.type,
                            "content": wanIp
                        }

                        # Update the content of a single DNS record.
                        domain.dns.update(dns_entry_data)

                        print(f"DNS entry updated with WAN IP: {wanIp}")
                    else:
                        print("No change detected. No update needed.")


if __name__ == "__main__":

    # Do a run from the get go
    transipDDNS()

    # Run every hour.
    # Check schedule API if you want to change the scheduler
    # https://github.com/dbader/schedule
    schedule.every().hour.do(transipDDNS)

    while True:
        schedule.run_pending()
        time.sleep(1)
