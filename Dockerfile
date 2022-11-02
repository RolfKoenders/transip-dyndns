# Python Base Image
FROM python:3.9-alpine

RUN apk add -U --no-cache gcc build-base linux-headers ca-certificates python3-dev libffi-dev libressl-dev libxslt-dev

RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir python-transip schedule

WORKDIR /transip-ddns

ADD . /transip-ddns

CMD [ "python", "transip-ddns.py" ]