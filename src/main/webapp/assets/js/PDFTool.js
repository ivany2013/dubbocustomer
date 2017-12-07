function pdfInit(url_){
	//var url = 'http://localhost:8080/assets/css/a.pdf';
	var url=url_;
	// The workerSrc property shall be specified.
	PDFJS.workerSrc = '/assets/js/pdf.worker.js';

	var pdfDoc = null,
	    pageNum = 1,
	    pageRendering = false,
	    pageNumPending = null,
	    scale = 0.8,
	    canvas = document.getElementById('the-canvas'),
	    ctx = canvas.getContext('2d');

	/**
	 * Get page info from document, resize canvas accordingly, and render page.
	 * @param num Page number.
	 */
	function renderPage(num) {
	  pageRendering = true;
	  // Using promise to fetch the page
	  pdfDoc.getPage(num).then(function(page) {
	    var viewport = page.getViewport(scale);
	    canvas.height = viewport.height;
	    canvas.width = viewport.width;
	    canvas.width = viewport.width;
	    // Render PDF page into canvas context
	    var renderContext = {
	      canvasContext: ctx,
	      viewport: viewport
	    };
	    var renderTask = page.render(renderContext);

	    // Wait for rendering to finish
	    renderTask.promise.then(function() {
	      pageRendering = false;
	      if (pageNumPending !== null) {
	        // New page rendering is pending
	        renderPage(pageNumPending);
	        pageNumPending = null;
	      }
	    });
	  });

	  // Update page counters
	  document.getElementById('page_num').textContent = pageNum;
	}

	/**
	 * If another page rendering in progress, waits until the rendering is
	 * finised. Otherwise, executes rendering immediately.
	 */
	function queueRenderPage(num) {
	  if (pageRendering) {
	    pageNumPending = num;
	  } else {
	    renderPage(num);
	  }
	}

	/**
	 * Displays previous page.
	 */
	function onPrevPage(e) {
	   e.preventDefault();
	   e.stopPropagation();
	  if (pageNum <= 1) {
	    return;
	  }
	  pageNum--;
	  queueRenderPage(pageNum);
	  return false;
	}

	$("#prev").on("click",function(e){
		onPrevPage(e);
	})

	/**
	 * Displays next page.
	 */
	function onNextPage(e) {
	   e.preventDefault();
	   e.stopPropagation();
	  if (pageNum >= pdfDoc.numPages) {
	    return;
	  }
	  pageNum++;
	  queueRenderPage(pageNum);
	 
	  return false;
	}

	$("#next").on("click",function(e){
		onNextPage(e);
	})

	/**
	 * Asynchronously downloads PDF.
	 */
	PDFJS.getDocument(url).then(function(pdfDoc_) {
	  pdfDoc = pdfDoc_;
	  document.getElementById('page_count').textContent = pdfDoc.numPages;

	  // Initial/first page rendering
	  renderPage(pageNum);
	});
}
