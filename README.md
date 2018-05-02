# Задача «Гейб слишком занят»

Ссылка Now: https://webdev-task-8-zkcnsfvdqi.now.sh/

Перед выполнением задания внимательно прочитайте:

- [О всех этапах проверки задания](https://github.com/urfu-2017/guides/blob/master/workflow/overall.md)
- [Как отправить пулл](https://github.com/urfu-2017/guides/blob/master/workflow/pull.md)
- [Как пройти тесты](https://github.com/urfu-2017/guides/blob/master/workflow/test.md)
- Правила оформления [javascript](https://github.com/urfu-2017/guides/blob/master/codestyle/js.md), [HTML](https://github.com/urfu-2017/guides/blob/master/codestyle/html.md) и [CSS](https://github.com/urfu-2017/guides/blob/master/codestyle/css.md) кода

## Основное задание

Все сувениры в магазине Билли быстро раскупили, поэтому теперь ему хочется попробовать себя в геймдеве.

Билли слышал, что самый популярный тренд в играх – это ремастеры, и у Билли как раз есть на примете игра из его детства.
Так как в этой сфере Билли новичок, ему должен был помочь его друг Гейб, но Билли боится, что тот добавит в его любимую игру лутбоксы. Надеясь на ваше бескорыстие, Билли просит помощи у вас.

## Требования

Предыдущие задания были достаточно хардкорные и формальные, поэтому в этот раз мы подготовили
для вас кое-что фановое™. Предлагаем реализовать простую игру в стиле [тамагочи](https://ru.wikipedia.org/wiki/%D0%A2%D0%B0%D0%BC%D0%B0%D0%B3%D0%BE%D1%87%D0%B8).

В первую очередь, вам необходимо нарисовать персонажа при помощи SVG.
Для добавления интерактивных анимаций к нему рекомендуем использовать
[snapsvg.io](http://snapsvg.io/).
В качестве персонажа предлагается использовать уже знакомого вам Хрюнделя.

![](https://cloud.githubusercontent.com/assets/4534405/14706865/b8d57320-07da-11e6-9205-8dc4e838b8de.png)

Персонаж должен обладать тремя характерстиками: **сытость**, **энергия**, **настроение**.
В начале все три характеристики равны 100% и со временем уменьшаются.

##### Хрюндель должен уметь

- Сохранять своё состояние и уметь его восстанавливать
  даже после закрытия браузера. Это касается и изменения его характеристик.

- Засыпать, когда вы уходите с вкладки и просыпаться когда вы возвращаетесь,
  либо когда в комнате становится очень темно.
  При этом процесс засыпания и пробуждения должен сопровождаться анимацией.
  Во время сна восстанавливается **энергия**.

- Питаться, при подключении зарядного устройства. Если такая возможность недоступна,
  выводить кнопку, по нажатию на которую также можно накормить Хрюнделя.
  Во время питания восстанавливается **сытость**.

- Начинать вас слушать при клике по нему. Распознанная фраза выводится на экране
  и поднимает **настроение** персонажа. Как только настроение поднимается до максимума
  персонаж должен перестать вас слушать.

- Умирать при снижении **любых двух** характеристик до 0.

- Периодически издавать звуки, громкость которых можно настраивать.

- Когда вы находитесь на другой вкладке, Хрюндель должен писать вам сообщения
  если он проголодался или соскучился (любой из показателей снизился до 10%).

- Хочется, чтобы питание, радость от общения и смерть тоже были анимированы.

##### Нюансики

- Должна присутствовать возможность в любой момент начать игру заново.

- Когда Хрюндель выполняет какое-либо действие, он не может выполнять другое.
  - Общение прерывается сном, питанием или наполнением **настроения** до 100%
  - Питание прерывается сном или наполнением **сытости** до 100%
  - Сон прерывается активной вкладкой и наполнением **энергии** до 100%

- Изменение каждой из характеристик должно происходить линейно с течением времени.
  Накопление харакеристик логично сделать в 3-4 раза более быстрым, чем их расходование.

- Для реализации большинства возможностей рекомендуем использовать последние версии
  браузеров Chromium, Yandex.Browser или Chrome. Отсутствие в браузере возможности
  не должно влиять на общую работоспособность игры.

- Для демонстрации можно использовать now.

![Gabe](https://user-images.githubusercontent.com/8963033/39253521-8183d8ec-48c1-11e8-9b58-664f0f126078.png)
