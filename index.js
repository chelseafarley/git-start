const readline = require("readline");
const { exec } = require("child_process");
const fs = require('fs');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let handleError = (error) => {
  if (error) {
    console.log(`error: ${error.message}`);
    return;
  } 
};

let handleStandardError = (stderr) => {
  if (stderr) {
    console.log(`stderr: ${stderr}`);
    return;
  }
};

rl.question("Repo Name?", function(repoName) {
  if (repoName === "") {
    console.log("Repo name is required");
  } else {
    exec("git config user.username", (error, stdout, stderr) => {
      handleError(error);
      handleStandardError(stderr);

      let gitUsername = stdout.replaceAll(/\s/g,'');
      if (gitUsername === "") {
        console.log("Please set git config user.username");
      } else {
        exec(`security find-generic-password -w -s 'git-start' -a '${gitUsername}'`, (error, stdout, stderr) => {
          handleError(error);
          handleStandardError(stderr);
    
          let gitPersonalAccessToken = stdout.replaceAll(/\s/g,'');
          rl.question("Description?", function(description) {
            rl.question("Readme? Y/n Default: Y", function(readme) {
              rl.question("Public? Y/n Default: Y", function(public) {
                rl.question("Choose a license (optional). List here: https://api.github.com/licenses", function(license) {
                  rl.question("Choose tech comma delimited (optional). List here: https://www.toptal.com/developers/gitignore/api/list", function(tech) {
                    // Don't want any spaced in the tech list
                    tech = tech.replaceAll(" ", "");
      
                    // Default the following to Y
                    let autoInit = readme.toLowerCase() === "n" ? false : true;
                    let private = public.toLowerCase() === "n" ? true : false;
      
                    let repoRequest = {
                      name: repoName,
                      description: description,
                      auto_init: autoInit,
                      license_template: license,
                      private: private
                    };

                    exec(`curl -u '${gitUsername}:${gitPersonalAccessToken}' https://api.github.com/user/repos -d  '${JSON.stringify(repoRequest)}'`, (error, stdout, stderr) => {
                      handleError(error);
                      handleStandardError(stderr);

                      exec(`git clone https://github.com/${gitUsername}/${repoName}.git`, (error, stdout, stderr) => {
                        handleError(error);
                        handleStandardError(stderr);

                        exec(`curl https://www.toptal.com/developers/gitignore/api/${tech}`, (error, stdout, stderr) => {
                          handleError(error);
                          handleStandardError(stderr);

                          // Create file with output of request
                          fs.appendFile(`${repoName}/.gitignore`, stdout, (error) => {
                            handleError(error);
                            exec(`cd ${repoName} && git add . && git commit -m "Added .gitignore" && git push`, (error, stdout, stderr) => {
                              handleError(error);
                              handleStandardError(stderr);
                              rl.close();
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      }
    });
  }
});

rl.on("close", function() {
  process.exit(0);
});