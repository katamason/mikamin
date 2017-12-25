var root = typeof exports !== "undefined" && exports !== null ? exports : this;

var AstellasFooter = function(data) {
    if (this instanceof AstellasFooter) {
        var n, sn;


        if (data) {
            $.extend(this.classes, data.classes);
            this.config = data.json;

            if (data.isFullSizeLib) {
                $(this.classes.dropdownWrapClass).addClass('_fullsize');
                $(this.classes.footerClass).append('<div class="footer__overlay"></div>');
            };
        }

        this.root = root;
        console.log(this.root)
        this.page = window.location.pathname.split("/").pop();
        this.root.node = this.root.node || false;

        this.root.lockFooter = this.root.lockFooter || false;
        this.root.nav = {};
        this.root.prevPage = '';
        this.root.nextPage = '';

        this.prevSlide = CommunicateEmbedded.getData('prevSlide');
        CommunicateEmbedded.setData('prevSlide', this.page);

        n = CommunicateEmbedded.getData('nodes');

        if (n) {
            this.slides = n.split(',');
            this.footerPathLinkActivate();
        }

        this.init_nav();

        this.init_lib();

        this.checkRootNode(n);

        this.bindFooterTap();
        this.bindFooterSiblingsTap();
        this.bindHomeLink();
        this.useScroll($(this.classes.listDropdownClass)[1], $(".footer__dropdown").height() - 50);

    } else return new AstellasFooter(data);
}

AstellasFooter.prototype = {
    navLength: 5,

    classes: {
        footerClass: '.footer',
        footerTapClass: '.footer__tap',
        footerWrapClass: '.footer__wrap',
        pathLinkClass: '.footer__link_path',
        libLinkClass: '.footer__link_lib',
        homeLinkClass: '.footer__link_home',
        backLinkClass: '.footer__link_back',
        libDropdownClass: '.dropdown_lib',
        navDropdownClass: '.dropdown_nav',
        listDropdownClass: '.dropdown__list',
        dropdownClass: '.dropdown',
        dropdownWrapClass: '.footer__dropdown',
        overlayClass: '.footer__overlay'
    },

    checkRootNode: function(n) {
        var k, len, i, flagN;

        if (this.root.node) {
            if (n) {
                for (k = 0, len = this.slides.length; k < len; k++) {
                    i = this.slides[k];
                    if (this.page === i) {
                        console.log('node already added');
                        flagN = true;
                    }
                }
                if (!flagN) {
                    CommunicateEmbedded.setData('nodes', this.page + ',' + n);
                }
            } else {
                CommunicateEmbedded.setData('nodes', this.page);
            }
        }
    },

    footerPathLinkActivate: function() {
        var self = this;
        $(this.classes.pathLinkClass).parent().addClass('footer__item_active');

        this.bindPathLink();
    },

    init_lib: function() {
        var self = this;
        var j, l, len1, ref, results;

        for (var i = 0; i < this.config.sections.length; i++) {
            var currentSection = this.config.sections[i];

            for (var k = 0; k < currentSection.slides.length; k++) {
                var currentSlide = currentSection.slides[k];

                if (currentSlide.source == self.page && (typeof currentSlide.attachments != 'undefined' && currentSlide.attachments.length > 0)) {

                    $(this.classes.libLinkClass).hammer().bind('tap', function(e) {

                        $(self.classes.navDropdownClass).hide().removeClass('_visible');
                        $(self.classes.libDropdownClass).toggle().toggleClass('_visible');
                        $(self.classes.overlayClass).toggle();
                        $(self.classes.dropdownWrapClass).toggle();
                        if ($(self.classes.libDropdownClass).hasClass('_visible')) {
                            $(self.classes.dropdownWrapClass).show();
                        } else {
                            $(self.classes.dropdownWrapClass).hide();
                        }

                        return false;
                    });

                    ref = currentSlide.attachments;
                    // results = [];

                    for (j = l = 0, len1 = ref.length; l < len1; j = ++l) {
                        i = ref[j];
                        $(this.classes.libDropdownClass + '>' + this.classes.listDropdownClass)
                            .append('<li class="dropdown__item"><div data-nav="' + i.alias + '" class="dropdown__link dropdown__link_' + i.alias + '">' + i.name + '</div></li>');


                    }

                    $(this.classes.libDropdownClass + '>' + this.classes.listDropdownClass + '>.dropdown__item>.dropdown__link').hammer().bind('tap', function(e) {
                        n = $(this).attr('data-nav');
                        if (n.length > 0) {
                            CommunicateEmbedded.openAttachment(n);
                            $(self.classes.dropdownClass).hide();
                            $(self.classes.overlayClass).hide();
                            $(self.classes.dropdownWrapClass).hide();
                            $(self.classes.navDropdownClass).hide().removeClass('_visible');
                            $(self.classes.libDropdownClass).hide().removeClass('_visible');
                        }
                    });
                    // return results;
                }
            }
        }
    },

    init_nav: function() {
        var self = this;

        var crit, j, l, len1, len2, len6, m, o, p, ref, ref1, t, x, z, index,
            rootSlidesChain = [];
        ref = this.config.sections;

        for (z = l = 0, len1 = ref.length; l < len1; z = ++l) {
            o = ref[z];

            ref1 = this.config.sections[z].slides;

            for (j = m = 0, len2 = ref1.length; m < len2; j = ++m) {
                i = ref1[j];
                p = i.source.split("/").pop();
                if (p === this.prevSlide && this.prevSlide !== void 0) {
                    if (typeof i.alias != 'undefined') {
                        n = i.alias;
                    } else {
                        n = i.name;
                    }

                    $(this.classes.backLinkClass).hammer().bind('tap', function(e) {
                        return setTimeout((function() {
                            CommunicateEmbedded.navigate(n);
                        }), 190);
                    });
                }
                if (self.slides !== void 0) {
                    for (t = 0, len6 = self.slides.length; t < len6; t++) {
                        x = self.slides[t];

                        if (p === x) {
                            rootSlidesChain.push({
                                name: i.name,
                                alias: i.alias
                            });

                            if (p === self.page) {
                                index = rootSlidesChain.length - 1;
                            }
                        }
                    }
                }
            }


        }
        this.createNavMenu(rootSlidesChain, index);
    },


    createNavMenu: function(rootSlidesChain, index) {
        var startCycleIndex,
            endCycleIndex;

        if (typeof index == 'undefined') {
            index = rootSlidesChain.length;
        }

        if (this.navLength < rootSlidesChain.length && (index - this.navLength > 0)) {
            startCycleIndex = index - this.navLength;
            endCycleIndex = index;
        } else if (this.navLength < rootSlidesChain.length) {
            startCycleIndex = 0;
            endCycleIndex = startCycleIndex + this.navLength;
        } else {
            startCycleIndex = 0;
            endCycleIndex = rootSlidesChain.length;
        }

        for (var i = startCycleIndex; i < endCycleIndex; i++) {
            $(this.classes.navDropdownClass + '>' + this.classes.listDropdownClass)
                .append('<li class="dropdown__item"><div data-nav="' + (rootSlidesChain[i].alias ? rootSlidesChain[i].alias : rootSlidesChain[i].name) + '" class="dropdown__link dropdown__link_' + (rootSlidesChain[i].alias ? rootSlidesChain[i].alias.split('.')[0] : rootSlidesChain[i].name.split('.')[0]) + '">' + rootSlidesChain[i].name + '</div></li>');

            if (i === index) {
                $(this.classes.navDropdownClass + '>' + this.classes.listDropdownClass).children().last().children().css('color', '#D3D3D3').addClass('_disable');
            }


        }

        $(this.classes.navDropdownClass + '>' + this.classes.listDropdownClass + '>.dropdown__item>.dropdown__link').not('_disable').hammer().bind('tap', function(e) {
            n = $(this).attr('data-nav');

            if (n.length > 0) {
                setTimeout((function() {
                    return CommunicateEmbedded.navigate(n);
                }), 190);
                return false;
            }
        });
    },

    bindHomeLink: function() {
        var self = this;

        $(this.classes.homeLinkClass).hammer().bind('tap', function(e) {
            return setTimeout((function() {
                return CommunicateEmbedded.fireEvent('homeSlide');
            }), 190);
        });
    },

    bindFooterTap: function() {
        var self = this;

        $(this.classes.footerTapClass).hammer().bind('tap', function(e) {
            self.showFooter();
        });
    },

    bindFooterSiblingsTap: function() {
        var self = this;

        $(this.classes.footerClass).siblings().add(this.classes.overlayClass).hammer().bind('tap', function(e) {
            $(self.classes.overlayClass).hide();
            $(self.classes.dropdownWrapClass).hide();
            $(self.classes.navDropdownClass).hide().removeClass('_visible');
            $(self.classes.libDropdownClass).hide().removeClass('_visible');
            return $(self.classes.dropdownClass).hide();
        });
    },


    bindPathLink: function() {
        var self = this;

        $(this.classes.pathLinkClass).hammer().bind('tap', function(e) {
            $(self.classes.libDropdownClass).hide().removeClass('_visible');
            $(self.classes.overlayClass).hide();
            $(self.classes.dropdownWrapClass).toggle();
            if ($(self.classes.navDropdownClass).hasClass('_visible')) {
                $(self.classes.dropdownWrapClass).hide();
            } else {
                $(self.classes.dropdownWrapClass).show();
            }
            return $(self.classes.navDropdownClass).toggle().toggleClass('_visible');
        });
    },

    /**
     * использовать если нужен футер открытый при ините слайда
     */
    showFooter: function() {
        // if (!this.root.lockFooter) {
        //     $(this.classes.footerWrapClass).toggleClass('footer__wrap_show');
        // }
        // $(this.classes.overlayClass).hide();
        // $(this.classes.dropdownWrapClass).hide();
        // $(this.classes.navDropdownClass).hide().removeClass('_visible');
        // $(this.classes.libDropdownClass).hide().removeClass('_visible');
        // $(this.classes.dropdownClass).hide();
    },

    /* для скролла либы (вытащен из diagnostics.js и слегка изменен)*/
    useScroll: function(element, hh) {
        var view, indicator, relative,
            min, max, offset, reference, pressed, xform,
            velocity, frame, timestamp, ticker,
            amplitude, target, timeConstant;

        function ypos(e) {
            // touch event
            if (e.targetTouches && (e.targetTouches.length >= 1)) {
                return e.targetTouches[0].clientY;
            }

            // mouse event
            return e.clientY;
        }

        function scroll(y) {
            if (typeof max == 'undefined') {
                max = parseInt($(view).height(), 10) - hh;
            }
            if ($(view).height() > 500) {
                offset = (y > max) ? max : (y < min) ? min : y;

                view.style[xform] = 'translateY(' + (-offset) + 'px)';
            }
        }

        function track() {
            var now, elapsed, delta, v;

            now = Date.now();
            elapsed = now - timestamp;
            timestamp = now;
            delta = offset - frame;
            frame = offset;

            v = 1000 * delta / (1 + elapsed);
            velocity = 0.8 * v + 0.2 * velocity;
        }

        function autoScroll() {
            var elapsed, delta;

            if (amplitude) {
                elapsed = Date.now() - timestamp;
                delta = -amplitude * Math.exp(-elapsed / timeConstant);
                if (delta > 0.5 || delta < -0.5) {
                    scroll(target + delta);
                    requestAnimationFrame(autoScroll);
                } else {
                    scroll(target);
                }
            }
        }

        function tap(e) {
            pressed = true;
            reference = ypos(e);

            velocity = amplitude = 0;
            frame = offset;
            timestamp = Date.now();
            clearInterval(ticker);
            ticker = setInterval(track, 100);

            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        function drag(e) {
            var y, delta;

            if (pressed) {
                y = ypos(e);
                delta = reference - y;
                if (delta > 2 || delta < -2) {
                    reference = y;
                    scroll(offset + delta);
                }
            }
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        function release(e) {
            pressed = false;

            clearInterval(ticker);
            if (velocity > 10 || velocity < -10) {
                amplitude = 0.8 * velocity;
                target = Math.round(offset + amplitude);
                timestamp = Date.now();
                requestAnimationFrame(autoScroll);
            }

            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        view = element;
        if (typeof window.ontouchstart !== 'undefined') {
            view.addEventListener('touchstart', tap);
            view.addEventListener('touchmove', drag);
            view.addEventListener('touchend', release);
        }
        view.addEventListener('mousedown', tap);
        view.addEventListener('mousemove', drag);
        view.addEventListener('mouseup', release);

        offset = min = 0;
        pressed = false;
        timeConstant = 325; // ms

        relative = (hh - 30) / max;

        xform = 'transform';
        ['webkit', 'Moz', 'O', 'ms'].every(function(prefix) {
            var e = prefix + 'Transform';
            if (typeof view.style[e] !== 'undefined') {
                xform = e;
                return false;
            }
            return true;
        });

        view.style[xform] = 'translateY(0px)';
    }
}