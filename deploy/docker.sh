#!/bin/bash

apiURL="https://api.tracker.yandex.net/v2/issues/_search"
lastTag=$(git tag | sort -r | head -n1)
id="Gorkiy/shri-2021-infra/${lastTag}"
authHeader="Authorization: OAuth ${trackerOauth}"
orgidHeader="X-Org-Id: 6461097"
contentHeader="Content-Type: application/json"

docker build . -f Dockerfile -t app:${lastTag}

if [ $? = "0" ]
then
	echo "Docker image has been built successfully"
else
	echo "Failed to build docker image"
	exit 1
fi

imageId=`docker images | grep "${lastTag}" | awk '{print $3}'`
docker images

ticket=$(curl --silent --location --request POST ${apiURL} \
    --header "${authHeader}" \
    --header "${orgidHeader}" \
    --header "${contentHeader}" \
    --data-raw '{
        "filter": {
            "queue": "'TMP'",
            "unique": "'${id}'"
        }
    }'
)

TICKETID=`echo $ticket | sed 's/\([^\,]*\)"id":"\([^"]*\)\(.*\)/\1\n\2/' | tail -1`
echo "TICKET ID:${TICKETID}"

RESULT=$(curl --silent --location --request POST https://api.tracker.yandex.net/v2/issues/${TICKETID}/comments \
    --header "${authHeader}" \
    --header "${orgidHeader}" \
    --header "${contentHeader}" \
    --data-raw '{
        "text": "Создан докер-образ #'${imageId}'"
    }'
)