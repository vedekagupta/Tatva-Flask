function initWordCloud() {
    const words = ["Dharma", "Karma", "Moksha", "Atman", "Brahman"];
    const cloud = document.querySelector('.word-cloud');
    const detail = document.querySelector('.word-detail');

    cloud.innerHTML = "";
    words.forEach(word => {
        const span = document.createElement('span');
        span.className = 'word-item';
        span.innerText = word;
        span.onclick = () => {
            detail.innerHTML = `<h4>${word}</h4><p>Definition and explanation of ${word} from Sanskrit texts...</p>`;
        };
        cloud.appendChild(span);
    });
}
