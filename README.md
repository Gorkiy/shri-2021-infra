## Как происходит проверка:

Скрипты, используемые в тестах, лежат в папке `/deploy/`.

Деплой автоматически случается с помощью Travis CI при пуше комита в репозиторий. Для создания нового тикета необходимо выполнить такие шаги:

* Создать один или несколько комитов, которые войдут в ближайший релиз.
* Добавить новый тег гит версии:
```
git tag -a v0.5 -m "Release candidate v0.5"
git push origin --tags
```

Через пару минут будет создан тикет с ченжлогом и комментариями о результатах сборки Docker-образа и прохождении тестов.
[Пример тикета](https://tracker.yandex.ru/TMP-1161)

Чтобы проверить, что не создаются новые тикеты, а обновляются текущий, необходимо запушить любой комит без добавления новых тегов.