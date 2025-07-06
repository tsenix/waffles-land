(() => {
    "use strict";
    const buttonMenuOpen = document.querySelector(".header__menu-button");
    const buttonMenuClose = document.querySelector(".menu__close");
    const menu = document.querySelector(".menu");
    const menuLinks = document.querySelectorAll(".menu__link");
    buttonMenuOpen.addEventListener("click", () => {
        menu.classList.add("active");
        document.documentElement.classList.add("lock");
    });
    buttonMenuClose.addEventListener("click", () => {
        menu.classList.remove("active");
        document.documentElement.classList.remove("lock");
    });
    for (const link of menuLinks) link.addEventListener("click", () => {
        menu.classList.remove("active");
        document.documentElement.classList.remove("lock");
    });
    const subMenuButton = document.querySelector(".header__link-menu");
    const subMenu = subMenuButton.querySelector(".header__submenu");
    const subMenuLinks = subMenu.querySelectorAll(".header__submenu-link");
    subMenuButton.addEventListener("click", () => {
        subMenu.classList.toggle("open");
        subMenuButton.classList.toggle("open");
    });
    for (const link of subMenuLinks) link.addEventListener("click", e => {
        e.stopPropagation();
        subMenu.classList.remove("open");
        subMenuButton.classList.remove("open");
    });
    document.addEventListener("click", function(e) {
        const target = e.target;
        const its_subMenu = target == subMenu || subMenu.contains(target);
        const its_subMenuButton = target.closest(".header__link-menu") == subMenuButton;
        const subMenu_is_active = subMenu.classList.contains("open");
        if (!its_subMenu && !its_subMenuButton && subMenu_is_active) {
            subMenu.classList.remove("open");
            subMenuButton.classList.remove("open");
        }
    });
    let _slideUp = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = `${target.offsetHeight}px`;
            target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            window.setTimeout(() => {
                target.hidden = !showmore ? true : false;
                !showmore ? target.style.removeProperty("height") : null;
                target.style.removeProperty("padding-top");
                target.style.removeProperty("padding-bottom");
                target.style.removeProperty("margin-top");
                target.style.removeProperty("margin-bottom");
                !showmore ? target.style.removeProperty("overflow") : null;
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideUpDone", {
                    detail: {
                        target
                    }
                }));
            }, duration);
        }
    };
    let _slideDown = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.hidden = target.hidden ? false : null;
            showmore ? target.style.removeProperty("height") : null;
            let height = target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            target.offsetHeight;
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = height + "px";
            target.style.removeProperty("padding-top");
            target.style.removeProperty("padding-bottom");
            target.style.removeProperty("margin-top");
            target.style.removeProperty("margin-bottom");
            window.setTimeout(() => {
                target.style.removeProperty("height");
                target.style.removeProperty("overflow");
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideDownDone", {
                    detail: {
                        target
                    }
                }));
            }, duration);
        }
    };
    let _slideToggle = (target, duration = 500) => {
        if (target.hidden) return _slideDown(target, duration); else return _slideUp(target, duration);
    };
    function spollers() {
        const spollersArray = document.querySelectorAll("[data-spollers]");
        if (spollersArray.length > 0) {
            document.addEventListener("click", setSpollerAction);
            const spollersRegular = Array.from(spollersArray).filter(function(item, index, self) {
                return !item.dataset.spollers.split(",")[0];
            });
            if (spollersRegular.length) initSpollers(spollersRegular);
            function initSpollers(spollersArray) {
                spollersArray.forEach(spollersBlock => {
                    spollersBlock.classList.add("_spoller-init");
                    initSpollerBody(spollersBlock);
                });
            }
            function initSpollerBody(spollersBlock) {
                let spollerItems = spollersBlock.querySelectorAll("details");
                if (spollerItems.length) spollerItems.forEach(spollerItem => {
                    let spollerTitle = spollerItem.querySelector("summary");
                    spollerTitle.removeAttribute("tabindex");
                    spollerItem.open = false;
                    spollerTitle.nextElementSibling.hidden = true;
                });
            }
            function setSpollerAction(e) {
                const el = e.target;
                if (el.closest("summary") && el.closest("[data-spollers]")) {
                    e.preventDefault();
                    if (el.closest("[data-spollers]").classList.contains("_spoller-init")) {
                        const spollerTitle = el.closest("summary");
                        const spollerBlock = spollerTitle.closest("details");
                        const spollersBlock = spollerTitle.closest("[data-spollers]");
                        const oneSpoller = spollersBlock.hasAttribute("data-one-spoller");
                        const scrollSpoller = spollerBlock.hasAttribute("data-spoller-scroll");
                        const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                        if (!spollersBlock.querySelectorAll("._slide").length) {
                            if (oneSpoller && !spollerBlock.open) hideSpollersBody(spollersBlock);
                            !spollerBlock.open ? spollerBlock.open = true : setTimeout(() => {
                                spollerBlock.open = false;
                            }, spollerSpeed);
                            spollerTitle.classList.toggle("_spoller-active");
                            _slideToggle(spollerTitle.nextElementSibling, spollerSpeed);
                            if (scrollSpoller && spollerTitle.classList.contains("_spoller-active")) {
                                const scrollSpollerValue = spollerBlock.dataset.spollerScroll;
                                const scrollSpollerOffset = +scrollSpollerValue ? +scrollSpollerValue : 0;
                                const scrollSpollerNoHeader = spollerBlock.hasAttribute("data-spoller-scroll-noheader") ? document.querySelector(".header").offsetHeight : 0;
                                window.scrollTo({
                                    top: spollerBlock.offsetTop - (scrollSpollerOffset + scrollSpollerNoHeader),
                                    behavior: "smooth"
                                });
                            }
                        }
                    }
                }
                const spollersClose = document.querySelectorAll("[data-spoller-close]");
                if (spollersClose.length) spollersClose.forEach(spollerClose => {
                    const menuLiks = spollerClose.querySelectorAll(".spoiler-link");
                    const spollerTitle = spollerClose.querySelector("summary");
                    const spollerCloseBlock = spollerTitle.parentNode;
                    for (const link of menuLiks) link.addEventListener("click", () => {
                        spollerTitle.classList.remove("_spoller-active");
                        _slideUp(spollerTitle.nextElementSibling, 500);
                        setTimeout(() => {
                            spollerCloseBlock.open = false;
                        }, 500);
                    });
                });
            }
            function hideSpollersBody(spollersBlock) {
                const spollerActiveBlock = spollersBlock.querySelector("details[open]");
                if (spollerActiveBlock && !spollersBlock.querySelectorAll("._slide").length) {
                    const spollerActiveTitle = spollerActiveBlock.querySelector("summary");
                    const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                    spollerActiveTitle.classList.remove("_spoller-active");
                    _slideUp(spollerActiveTitle.nextElementSibling, spollerSpeed);
                    setTimeout(() => {
                        spollerActiveBlock.open = false;
                    }, spollerSpeed);
                }
            }
        }
    }
    document.addEventListener("DOMContentLoaded", () => {
        spollers();
    });
    const footerSpoller = document.querySelector(".footer__spoller");
    const footerSpollerBlock = footerSpoller.querySelector(".footer__spoller-item");
    const footerSpollerTitle = footerSpoller.querySelector(".footer__spoller-title");
    const footerSpollerBody = footerSpoller.querySelector(".footer__spoller-body");
    document.addEventListener("click", function(e) {
        const target = e.target;
        const its_spollerBody = target == footerSpollerBody || footerSpollerBody.contains(target);
        const its_spollerTitle = target.closest(".footer__spoller-title") == footerSpollerTitle;
        const spoller_is_active = footerSpollerTitle.classList.contains("_spoller-active");
        if (!its_spollerBody && !its_spollerTitle && spoller_is_active) {
            footerSpollerTitle.classList.remove("_spoller-active");
            _slideUp(footerSpollerTitle.nextElementSibling, 500);
            setTimeout(() => {
                footerSpollerBlock.open = false;
            }, 500);
        }
    });
})();