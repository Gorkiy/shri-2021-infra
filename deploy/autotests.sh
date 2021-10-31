#!/bin/bash

apiURL="https://api.tracker.yandex.net/v2/issues/_search"
lastTag=$(git tag | sort -r | head -n1)
id="Gorkiy/shri-2021-infra/${lastTag}"
authHeader="Authorization: OAuth AQAAAAAAqu8IAAd44L0wFjF6Z00rm_33Yz7oltM"
orgidHeader="X-Org-Id: 6461097"
contentHeader="Content-Type: application/json"

npx jest
if [ $? = "0" ]
then
	echo "Autotests completed succesfully"
else
	echo "Autotests failed"
	exit 1
fi

ticket=$(curl --silent --location --request POST https://api.tracker.yandex.net/v2/issues/_search \
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

RESULT=$(curl --silent --location --request POST https://api.tracker.yandex.net/v2/issues/${TICKETID}/comments \
    --header "${authHeader}" \
    --header "${orgidHeader}" \
    --header "${contentHeader}" \
    --data-raw '{
        "text": "Тесты прошли успешно"
    }'
)