'use strict'

function makeId() {
    var id = 'b' + getNextIdx()
    return id
}

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min) // The maximum is exclusive and the minimum is inclusive
}

function getRandomFloat(min, max) {
    var float = Math.random() * (max - min) + min
    float = float.toFixed(2)
    return +float
}

function getLorem() {
    const lorem =
        `Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
        Sed id elit velit. Nunc bibendum justo a nisl commodo, vel fringilla mauris faucibus. 
        Maecenas vitae lorem eget lectus sodales bibendum quis vitae odio.
        Aliquam sed nunc at sapien ultrices vestibulum. Vivamus finibus nibh enim,
        quis varius ipsum lacinia vel. In hac habitasse platea dictumst.`

    return lorem
}