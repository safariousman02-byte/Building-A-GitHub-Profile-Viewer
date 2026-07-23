

const usernameInput = document.getElementById('usernameInput');
const searchBtn = document.getElementById('searchBtn');
const resultDiv = document.getElementById('result');

async function searchUser() {

    const username = usernameInput.value.trim();

    if (username === '') {
        resultDiv.innerHTML = `<div class="error">Please enter username!</div>` ;
        return;
    }

    resultDiv.innerHTML = `<div class="loading">Loading profile!...</div>` ;

    try {

        const userUrl = `https://api.github.com/users/${username}`;
        const userResponse = await fetch(userUrl);

        if(!userResponse.ok) {
            if (userResponse.status === 404) {
                throw new Error('User not found!');
            }else {
                throw new Error(`API error: ${userResponse.status}`);
            }  
        }

        const userData = await userResponse.json();

        const repostUrl = `https://api.github.com/users/${username}/repos?sort=updated&per_page=5`;

        const repostResponse = await fetch(repostUrl);

        const repostData = await repostResponse.json();

        let resposHTML = '';
        if (repostData.length > 0) {
            resposHTML = `<div class="repos">Recent Repositories</div>`;
            for(let i=0;i<repostData.length; i++) {
                const repo = repostData[i];
                resposHTML += `
                    <div class="repo-item">
                        <span class="repo-name">${repo.name}</span>
                        ${repo.language ? `<span class="repo-lang">${repo.language}</span>` : ''}
                    </div>
                `;
            }
            repoHTML += '</div>';
        } else {
            resposHTML = `
            <div class="repo">
                <h3>No public repository</h3>
            </div>`;
        }

    } catch(error) {
        resultDiv.innerHTML = `<div class="error">${error.message}</div>`;
        console.error('Error!', error);
    }

}

searchBtn.onclick = searchUser;

