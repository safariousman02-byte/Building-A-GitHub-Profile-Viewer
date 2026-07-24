
        const usernameInput = document.getElementById('usernameInput');
        const searchBtn = document.getElementById('searchBtn');
        const resultDiv = document.getElementById('result');

        
        async function searchUser() {
            // Get the username
            const username = usernameInput.value.trim();

            // Check if empty
            if (username === '') {
                resultDiv.innerHTML = '<div class="error">❌ Please enter a username!</div>';
                return;
            }

            // Show loading
            resultDiv.innerHTML = '<div class="loading">⏳ Loading profile...</div>';

            try {
                // ==========================================
                // API CALL 1: GET USER PROFILE
                // ==========================================
                const userUrl = `https://api.github.com/users/${username}`;
                const userResponse = await fetch(userUrl);

                // Check if user exists
                if (!userResponse.ok) {
                    if (userResponse.status === 404) {
                        throw new Error('User not found!');
                    } else {
                        throw new Error(`API error: ${userResponse.status}`);
                    }
                }

                const userData = await userResponse.json();

                // ==========================================
                // API CALL 2: GET USER REPOS
                // ==========================================
                const reposUrl = `https://api.github.com/users/${username}/repos?sort=updated&per_page=5`;
                const reposResponse = await fetch(reposUrl);
                const reposData = await reposResponse.json();

                // ==========================================
                // DISPLAY THE PROFILE
                // ==========================================

                // Build repos HTML
                let reposHTML = '';
                if (reposData.length > 0) {
                    reposHTML = '<div class="repos"><h3>📁 Recent Repositories</h3>';
                    for (let i = 0; i < reposData.length; i++) {
                        const repo = reposData[i];
                        reposHTML += `
                            <div class="repo-item">
                                <span class="repo-name">📂 ${repo.name}</span>
                                ${repo.language ? `<span class="repo-lang">${repo.language}</span>` : ''}
                            </div>
                        `;
                    }
                    reposHTML += '</div>';
                } else {
                    reposHTML = '<div class="repos"><h3>📁 No public repositories</h3></div>';
                }

                // Build profile card
                resultDiv.innerHTML = `
                    <div class="profile-card">
                        <img src="${userData.avatar_url}" alt="${userData.login}">
                        <div class="name">${userData.name || userData.login}</div>
                        <div class="username">@${userData.login}</div>
                        ${userData.bio ? `<div class="bio">📝 ${userData.bio}</div>` : ''}
                        ${userData.location ? `<div style="color: #666; font-size: 14px;">📍 ${userData.location}</div>` : ''}
                        ${userData.company ? `<div style="color: #666; font-size: 14px;">🏢 ${userData.company}</div>` : ''}
                        <div class="stats">
                            <div>
                                <div class="number">${userData.followers}</div>
                                <div class="label">Followers</div>
                            </div>
                            <div>
                                <div class="number">${userData.following}</div>
                                <div class="label">Following</div>
                            </div>
                            <div>
                                <div class="number">${userData.public_repos}</div>
                                <div class="label">Repositories</div>
                            </div>
                        </div>
                        <a href="${userData.html_url}" target="_blank" class="link">🔗 View on GitHub</a>
                        ${reposHTML}
                    </div>
                `;

            } catch (error) {
                // Show error
                resultDiv.innerHTML = `<div class="error">❌ ${error.message}</div>`;
                console.error('Error:', error);
            }
        }

        // ==========================================
        // EVENT LISTENERS
        // ==========================================

        // Click Search button
        searchBtn.onclick = searchUser;

        // Press Enter key
        usernameInput.onkeypress = function(event) {
            if (event.key === 'Enter') {
                searchUser();
            }
        };

        
        setTimeout(() => {
            usernameInput.value = 'octocat';
            searchUser();
        }, 500);
