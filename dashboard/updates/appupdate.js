        document.addEventListener('DOMContentLoaded', function() {
            const checkUpdateBtn = document.getElementById('check-update-btn');
            const updateLoading = document.getElementById('update-loading');
            const updateResult = document.getElementById('update-result');
            const updateStatus = document.getElementById('update-status');

            if (checkUpdateBtn) {
                checkUpdateBtn.addEventListener('click', checkForUpdates);
            }

            async function checkForUpdates() {
                // Show loading
                checkUpdateBtn.disabled = true;
                updateLoading.style.display = 'block';
                updateResult.style.display = 'none';

                // Simulate API call with delay
                try {
                    await new Promise(resolve => setTimeout(resolve, 6000));
                    
                    // Simulate update check result
                    const hasUpdate = Math.random() > 0.7; // 30% chance of having update
                    
                    // Hide loading
                    updateLoading.style.display = 'none';
                    updateResult.style.display = 'block';
                    
                    if (hasUpdate) {
                        updateResult.innerHTML = `
                            <div class="update-available">
                                <i class="fas fa-download"></i>
                                <h4>Update Available!</h4>
                                <p>Version 1.1.0 is now available with new features and improvements.</p>
                                <button class="login-button" onclick="downloadUpdate()">
                                    <i class="fas fa-download"></i> Download Update
                                </button>
                            </div>
                        `;
                    } else {
                        updateResult.innerHTML = `
                            <div class="update-current">
                                <i class="fas fa-check-circle"></i>
                                <h4>You're up to date!</h4>
                                <p>SugarTrack is running the latest version (1.0.0).</p>
                            </div>
                        `;
                    }
                    
                } catch (error) {
                    updateLoading.style.display = 'none';
                    updateResult.style.display = 'block';
                    updateResult.innerHTML = `
                        <div class="update-error">
                            <i class="fas fa-exclamation-triangle"></i>
                            <h4>Update Check Failed</h4>
                            <p>Unable to check for updates. Please try again later.</p>
                        </div>
                    `;
                } finally {
                    checkUpdateBtn.disabled = false;
                }
            }

            // Mock download function
            window.downloadUpdate = function() {
                alert('Update download would start here. In a real app, this would redirect to app store or download page.');
            };
        });