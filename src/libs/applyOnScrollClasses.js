export default function applyOnScrollClass(className, isVisibleClass, continueLoopAfterVisible) {
  if (!className || !isVisibleClass) {
    return
  }

  const scroll =
    window.requestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60)
    }

  const elementsToShow = Array.from(document.querySelectorAll(`.${className}`))

  loop(isVisibleClass, !!continueLoopAfterVisible, elementsToShow, scroll)
}

function loop(isVisibleClass, continueLoopAfterVisible, elementsToShow, scrollFn) {
  elementsToShow.forEach(function(element, index) {
    if (isElementInViewport(element)) {
      element.classList.add(isVisibleClass)

      if (!continueLoopAfterVisible) {
          elementsToShow.splice(index, 1)
      }

    } else {
      element.classList.remove(isVisibleClass)
    }
  })

  if (elementsToShow.length) {
    scrollFn(loop.bind(this, isVisibleClass, continueLoopAfterVisible, elementsToShow, scrollFn))
  }
}

function isElementInViewport(el) {
  const rect = el.getBoundingClientRect()

  return (
    (rect.top <= 0 && rect.bottom >= 0) ||
    (rect.bottom >=
      (window.innerHeight || document.documentElement.clientHeight) &&
      rect.top <=
        (window.innerHeight || document.documentElement.clientHeight)) ||
    (rect.top >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight))
  )
}
