window.addEventListener('load', function() {
    var dialog = document.querySelector('#lightbox-dialog-video');

    // A dialog element MUST be a child of document.body!!
    // In a SPA you should choose a more robust strategy than the simple if provided here
    if(dialog.parentNode.tagName !== 'BODY') {
        document.body.appendChild(dialog);
    }

    if (!('showModal' in dialog)) {
        dialogPolyfill.registerDialog(dialog);
    }

    var currentSlide = null;
    var lightboard = document.querySelector('#lightboard-for-lightbox-video');
    var slides = lightboard.querySelectorAll('.mdlext-lightboard__slide');

    lightboard.addEventListener('select', function(e) {
        currentSlide = e.detail.source;
        for (var i = 0, n = slides.length; i < n; i++) {
            if(currentSlide ===  slides[i]) {
                break;
            }
        }
        var prevSlide = slides[ i > 0   ? i-1 : n-1 ];
        var nextSlide = slides[ i < n-1 ? i+1 : 0];
        showVideo(currentSlide, prevSlide, nextSlide);
    });

    var lightbox = dialog.querySelector('.mdlext-lightbox');

    lightbox.addEventListener('action', function(e) {
        if(e.detail.action === 'close') {
            dialog.close();
        }
        else if(e.detail.action === 'select') {
            var figcaption = lightbox.querySelector('figure figcaption');
            if(figcaption.classList.contains('mdlext-lightbox__show-figcaption')) {
                figcaption.classList.remove('mdlext-lightbox__show-figcaption');
            }
            else {
                figcaption.classList.add('mdlext-lightbox__show-figcaption');
            }
        }
        else {
            var i = 0;
            var n = slides.length;

            if(e.detail.action === 'first') {
                currentSlide = slides[0];
            }
            else if(e.detail.action === 'prev' || e.detail.action === 'next') {
                for (var j = 0; j < n; j++) {
                    if(currentSlide ===  slides[j]) {
                        if(e.detail.action === 'prev') {
                            i = j > 0 ? j-1 : n-1;
                            currentSlide = slides[i];
                        }
                        else if(e.detail.action === 'next') {
                            i = j < n-1 ? j+1 : 0;
                            currentSlide = slides[i];
                        }
                        break;
                    }
                }
            }
            else if(e.detail.action === 'last') {
                i = slides.length-1;
                currentSlide = slides[i];
            }
            var prevSlide = slides[ i > 0   ? i-1 : n-1 ];
            var nextSlide = slides[ i < n-1 ? i+1 : 0];
            showVideo(currentSlide, prevSlide, nextSlide);
        }
    });

    function showVideo(slide, prevSlide, nextSlide) {
        var slideAnchor = slide.querySelector('a');
        var title = slide.querySelector('figcaption').textContent;
        var iframe = dialog.querySelector('iframe');
        var supportingText = dialog.querySelector('.mdl-card__supporting-text');
        var imageDetails = dialog.querySelector('figcaption');
        var href = slideAnchor.getAttribute('href') + '?wmode=opaque&amp;rel=0&amp;autohide=1&amp;showinfo=0&amp;wmode=transparent';
        iframe.setAttribute('src', href);
        supportingText.innerHTML = title;

        // prev
        slideAnchor = prevSlide.querySelector('a');
        href = slideAnchor.getAttribute('href');
        iframe.setAttribute('data-img-url-prev', href);
        // next
        slideAnchor = nextSlide.querySelector('a');
        href = slideAnchor.getAttribute('href');
        iframe.setAttribute('data-img-url-next', href);


        // details if exist
        if(slide.getAttribute('data-details') != null) {
            var detailsHtml  = '';
            var detailsArray = JSON.parse(slide.getAttribute('data-details').replace(/'/g, '"'));
            if (detailsArray != null) {
                detailsHtml = '<table><tbody>';
                for (var i = 0, n = detailsArray.length; i < n; i++) {
                    detailsHtml += '<tr><th>' + detailsArray[i].name + '</th><td>' + detailsArray[i].value + '</td></tr>';

                    if (!supportingText.innerHTML && detailsArray[i].name.toLowerCase() === 'title') {
                        supportingText.innerHTML = detailsArray[i].value;
                    }
                }
                detailsHtml += '</tbody></table>';
            }

            imageDetails.innerHTML = '';
            imageDetails.insertAdjacentHTML('afterbegin', detailsHtml);
        }

        if(!dialog.open){
            dialog.showModal();
        }
    }
});