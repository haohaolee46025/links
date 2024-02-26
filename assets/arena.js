// This allows us to process/render the descriptions, which are in Markdown!
// More about Markdown: https://en.wikipedia.org/wiki/Markdown
let markdownIt = document.createElement('script')
markdownIt.src = 'https://cdn.jsdelivr.net/npm/markdown-it@14.0.0/dist/markdown-it.min.js'
document.head.appendChild(markdownIt)



// Okay, Are.na stuff!
let channelSlug = 'green-an-ode-to-home' // The “slug” is just the end of the URL



// First, let’s lay out some *functions*, starting with our basic metadata:
let placeChannelInfo = (data) => { 
	// Target some elements in your HTML:  
	let channelTitle = document.getElementById('channel-title')
	let channelDescription = document.getElementById('channel-description')
	let channelCount = document.getElementById('channel-count')
	let channelLink = document.getElementById('channel-link')

	// Then set their content/attributes to our data:
	channelTitle.innerHTML = data.title
	channelDescription.innerHTML = window.markdownit().render(data.metadata.description) // Converts Markdown → HTML
	channelCount.innerHTML = data.length
	channelLink.href = `https://www.are.na/channel/${channelSlug}`
}



// Then our big function for specific-block-type rendering:
let renderBlock = (block) => {
	// To start, a shared `ul` where we’ll insert all our blocks
	let channelBlocks = document.getElementById('channel-blocks')

	// Links!
	if (block.class == 'Link') {

		let linkItem =
			`
			<li class="polaroid-grid" >

				<figure class="oldpaper">
					<img src="${ block.image.large.url }">
				</figure>

				<div class="polaroidtext">
					<p>${ block.description_html}</p>
					<h3>${ block.title }</h3>
					<p class=linktext><a href="${ block.source.url }" target="blank">See the original</a></p>
				</div>

			</li>
			`
		channelBlocks.insertAdjacentHTML('beforeend', linkItem)
	}

	// Images!
	else if (block.class == 'Image') {
		console.log(block.title)
		let imageItem =
			`
			<li class="polaroid-grid">

				<figure class="polaroid" >
					<img src="${block.image.large.url }">
				</figure>

				<div class="polaroidtext">
					<p>${ block.description_html}</p>
					<h3>${ block.title }</h3>
				</div>

			</li>
			`
		channelBlocks.insertAdjacentHTML('beforeend', imageItem)
	}


	// Text!
	else if (block.class == 'Text') {

		// console.log(block);
		let textItem =
			`
		<li class="text_content">

			<figure>
				<src="${ block.content_html }</src>
			</figure>
		</li>
			`
		channelBlocks.insertAdjacentHTML('beforeend', textItem);
	}

	
	// Uploaded (not linked) media…
	else if (block.class == 'Attachment') {
		let attachment = block.attachment.content_type // Save us some repetition

		// Uploaded videos!
		if (attachment.includes('video')) {
			// …still up to you, but we’ll give you the `video` element:
			// console.log(block)
			let videoItem =
			`
			<li class="polaroid-grid">

			<figure class="polaroid" id="video_content">
				 <div class=video>${block.embed.html}</div>
			</figure>

			<div class="polaroidtext">
				<h3>${ block.title }</h3>
			</div>

			</li>
				`
			channelBlocks.insertAdjacentHTML('beforeend', videoItem)
			// More on video, like the `autoplay` attribute:
			// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video
		}

		// // Uploaded PDFs!
	else if (attachment.includes('pdf')) {
		let pdfItem =
		`
		<li class="polaroid-grid">

			<figure class="polaroid" id="pdf_content">
				<img src=${block.image.large.url}></img>
			</figure>

			<div class="polaroidtext">
				<h3>${ block.title }</h3>
				<p class=linktext><a href="${ block.source.url }" target="blank">See the original</a></p>
			</div>

		</li>
			`
		channelBlocks.insertAdjacentHTML('beforeend', pdfItem)
		 }

		// Uploaded audio!
		else if (attachment.includes('audio')) {
			// …still up to you, but here’s an `audio` element:
			let audioItem =
				`
				<li class="polaroid-grid" >

					<figure class="polaroid" id="audio_content">
						<audio controls src="${ block.attachment.url }"></audio>
					</figure>

					<div class="polaroidtext">
						<h3>${ block.title }</h3>
					</div>

				</li>
				`
			channelBlocks.insertAdjacentHTML('beforeend', audioItem)
			// More on audio: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio
		}
	}

	// Linked media…
	else if (block.class == 'Media') {
		let embed = block.embed.type

		// Linked video!
		if (embed.includes('video')) {
			// …still up to you, but here’s an example `iframe` element:
		
			let linkedVideoItem =
			// console.log('this one=', block)

				`
				<li class="polaroid-grid">

				<figure class="polaroid" id="video_content">
			 		<div class=video>${block.embed.html}</div>
				</figure>

				<div class="polaroidtext">
					<h3>${ block.title }</h3>
				</div>

			</li>
				`
			channelBlocks.insertAdjacentHTML('beforeend', linkedVideoItem)
			// More on iframe: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe
		}

		// Linked audio!
		else if (embed.includes('rich')) {
			// …up to you!
			`
				<li class="polaroid-grid">

					<figure class="polaroid" id="audio_content">
						<audio controls src="${ block.attachment.url }"></audio>
					</figure>

					<div class="polaroidtext">
						<h3>${ block.title }</h3>
					</div>

				</li>
			`
		}
	}
}



// It‘s always good to credit your work:
let renderUser = (user, container) => { // You can have multiple arguments for a function!
	let userAddress =
		`
		<address>
			<img src="${ user.avatar_image.display }">
			<h3>${ user.first_name }</h3>
			<p><a href="https://are.na/${ user.slug }">Are.na profile ↗</a></p>
		</address>
		`
	container.insertAdjacentHTML('beforeend', userAddress)
}



// Now that we have said what we can do, go get the data:
fetch(`https://api.are.na/v2/channels/${channelSlug}?per=100`, { cache: 'no-store' })
	.then((response) => response.json()) // Return it as JSON data
	.then((data) => { // Do stuff with the data
		// console.log(data) // Always good to check your response!
		placeChannelInfo(data) // Pass the data to the first function

		// Loop through the `contents` array (list), backwards. Are.na returns them in reverse!
		data.contents.reverse().forEach((block) => {
			// console.log(block) // The data for a single block
			renderBlock(block) // Pass the single block data to the render function
		})

		// Also display the owner and collaborators:
		// let channelUsers = document.getElementById('channel-users') // Show them together
		// data.collaborators.forEach((collaborator) => renderUser(collaborator, channelUsers))
		// renderUser(data.user, channelUsers)
	})

// animation

window.addEventListener('scroll', function() {

    let images = document.querySelectorAll('.polaroid img');
    images.forEach((image) => {
        let distanceFromTop = image.getBoundingClientRect().top;
        let windowHeight = window.innerHeight;
        let viewportMiddle = windowHeight / 2;

        if (distanceFromTop < viewportMiddle && distanceFromTop > -windowHeight / 2) {
            let opacity = 1 - Math.abs(distanceFromTop - viewportMiddle) / windowHeight;
            image.style.opacity = opacity;
        }
    });


    let videos = document.querySelectorAll('#video_content');
    videos.forEach((video) => {
        let distanceFromTop = video.getBoundingClientRect().top;
        let windowHeight = window.innerHeight;
        let viewportMiddle = windowHeight / 2;

        if (distanceFromTop < viewportMiddle && distanceFromTop > -windowHeight / 2) {
            let moveRight = 3; 
            video.style.transition = 'transform 2s ease'; 
            video.style.transform = `translateX(${moveRight}rem)`;
        } else {
            video.style.transition = 'none'; 
            video.style.transform = 'none';
        }
    });
});


document.addEventListener('DOMContentLoaded', function() {

    let button = document.querySelector('button');
    button.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});

window.addEventListener('scroll', function() {
    let linkTexts = document.querySelectorAll('.linktext');
    linkTexts.forEach((linkText) => {
        let distanceFromTop = linkText.getBoundingClientRect().top;
        let windowHeight = window.innerHeight;
        let viewportBottom = windowHeight / 2; 
        if (distanceFromTop < viewportBottom) {
            linkText.style.opacity = 1; 
        }
    });

    
    window.removeEventListener('scroll', this);
});


window.addEventListener('scroll', function() {
	let scrollPosition = window.scrollY;
	let opacityValue = 0.3 - (scrollPosition / 1000); 
	document.getElementById('ireland-map').style.opacity = opacityValue;
	document.getElementById('ireland-map').style.filter = `blur(${scrollPosition / 30}px)`; // 滚动越多，模糊越多
  });


  
// 检测滚动事件
window.addEventListener('scroll', function() {
    var textContents = document.querySelectorAll('.text_content');
    
    // 對於每個元素進行遍歷
    textContents.forEach(function(textContent) {
        var rect = textContent.getBoundingClientRect();

        // 檢查元素是否在屏幕上半部
        if (rect.top < window.innerHeight / 6) {
            // 添加模糊和淡出效果的類
            textContent.classList.add('blur');
        } else {
            // 移除模糊和淡出效果的類
            textContent.classList.remove('blur');
        }
    });
});