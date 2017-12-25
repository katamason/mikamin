/**
 * @param treshold
 * @param multitouch
 * @param onSwipeNext = function (direction) {}
 * @param onSwipePrev = function (direction) {}
 */

var StoryCLMNavigation = function(data) {
    if (this instanceof StoryCLMNavigation) {

    } else {
        return new StoryCLMNavigation(treshold);
    }
};

StoryCLMNavigation.prototype = {
    /**
     * Блокирует всю навигацию
     */
    block: function(bool) {

    },

    /**
     * Блокирует навигацию вперед
     */
    blockNext: function(bool) {

    },

    /**
     * Блокирует навигацию назад
     */
    blockPrev: function(bool) {

    },

    /**
     * Одноразовый блок pan-ов
     */
    blockSwipe: function() {

    },

    /**
     * Проверка на наличие следующего/предыдущего слайда
     */
    isEmptyMeta: function(direction) {
        return !direction.length;
    },

    /**
     * Свайп вперед по умолчанию
     */
    onSwipeNext: function(direction) {
        window.location = direction;
    },

    /**
     * Свайп назад по умолчанию
     */
    onSwipePrev: function(direction) {
        window.location = direction;
    },

    /**
     * Свайп назад по истории по умолчанию
     */
    onSwipeBackward: function(count) {}
};
