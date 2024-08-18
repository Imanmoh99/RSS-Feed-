const rssFeedUrl = 'https://rsshub.app/telegram/channel/Ethioware';

async function fetchRSSFeed() {
    const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssFeedUrl)}`);
    const data = await response.json();

    const feedContainer = document.getElementById('rss-feed');
    let count = 0;


    for (let i = 0; i < data.items.length && count < 6; i++) {
        const item = data.items[i];

        // Skip posts containing "pinned a photo"
        if (item.description.includes("pinned a photo")) {
            continue;
        }

        const card = document.createElement('div');
        card.className = 'rss-card';

        // Create a temporary element to handle content
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = item.description;

        // Remove any "Forwarded from" text, this thing is not working for me I dont know how else to remove it
        const elementsToCheck = tempDiv.querySelectorAll('*');
        elementsToCheck.forEach(element => {
            if (element.innerText.includes("Forwarded from")) {
                element.remove();
            }
        });

        // Handle images: resize if present, remove empty space if not
        const images = tempDiv.querySelectorAll('img');
        if (images.length > 0) {
            images.forEach(img => {
                img.style.width = '100%';
                img.style.height = 'auto';
                img.style.maxHeight = '150px'; 
                img.style.objectFit = 'cover';
            });
        } else {
            tempDiv.querySelectorAll('br').forEach(br => br.remove()); 
        }

        card.innerHTML = `
            <h3>${item.title}</h3>
            <div>${tempDiv.innerHTML}</div>
            <a href="${item.link}" target="_blank">Read more</a>
        `;
        feedContainer.appendChild(card);
        count++;
    }
}

fetchRSSFeed();
