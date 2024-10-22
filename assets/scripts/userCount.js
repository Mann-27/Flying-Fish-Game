// class UserTracker {
//     constructor() {
//         this.userID = this.getUserID();
//         this.userName = this.getUserName(); // Get or prompt for username
//         this.uniqueUserCount = this.getUniqueUserCount();
//         this.totalVisitCount = this.getTotalVisitCount();

//         //this.startTime = Date.now();
//         this.scores = JSON.parse(localStorage.getItem(`scores_${this.userID}`)) || [];

//         // Ask if the user wants to continue as an existing user
//         const continueAsExisting = confirm("Do you want to continue as the existing user?");
//         if (continueAsExisting) {
//             alert(`Welcome back, ${this.userName}!`); // Welcome back message
//            // this.incrementTotalVisitCount(); // Increment the visit count for existing users
//         } else {
//             // If they don't want to continue, prompt for a new username
//             this.userName = this.promptForUserName();
//             localStorage.setItem('userName', this.userName); // Save the new username
//             this.incrementUniqueUserCount();
//             //this.incrementTotalVisitCount();
//         }
//     }

//     generateSimpleID() {
//         return Math.floor(Math.random().toString(36).substring(2));
//     }

//     getUserID() {
//         let userID = localStorage.getItem('userID');
//         if (!userID) {
//             userID = 'user_' + this.generateSimpleID();
//             localStorage.setItem('userID', userID);
//             //this.incrementUniqueUserCount(); // Increment the unique user count
//         }
//         return userID;
//     }

//     addScore(score) {
//         this.scores.push(score);
//         localStorage.setItem(`scores_${this.userID}`, JSON.stringify(this.scores));
//     }

//     getUserName() {
//         return localStorage.getItem('userName') || null; // Return null if userName doesn't exist
//     }

//     promptForUserName() {
//         let userName = prompt("Please enter your name:", "Guest");
//         while (!userName || userName.trim() === "") {
//             alert("Name cannot be empty. Please enter your name:");
//             userName = prompt("Please enter your name:", "Guest");
//         }
//         return userName; // Return the valid username
//     }

//     getUniqueUserCount() {
//         return localStorage.getItem('uniqueUserCount') || 0;
//     }

//     getTotalVisitCount() {
//         return localStorage.getItem('totalVisitCount') || 0;
//     }

//     incrementUniqueUserCount() {
//         let uniqueUserCount = Number(localStorage.getItem('uniqueUserCount')) || 0;
//         uniqueUserCount += 1;
//         localStorage.setItem('uniqueUserCount', uniqueUserCount);
//         this.uniqueUserCount = uniqueUserCount;
//     }

//     incrementTotalVisitCount() {
//         let totalVisitCount = Number(localStorage.getItem('totalVisitCount')) || 0;
//         totalVisitCount += 1;
//         localStorage.setItem('totalVisitCount', totalVisitCount);
//         this.totalVisitCount = totalVisitCount;
//     }

//     drawVisitCount(ctx) {
//         ctx.save();
//         ctx.textAlign = 'center';
//         ctx.fillStyle = 'black';
//         ctx.font = '24px Arial';
//         // Display user's name and other statistics
//         ctx.fillText(`Current Player's Name: ` + this.userName, 500, 270);
//         ctx.fillText('Total Visits: ' + this.totalVisitCount,500, 290);
//         ctx.fillText('Unique Users: ' + this.uniqueUserCount, 500, 310);
//         ctx.fillText(`Latest Score: ${this.scores.length > 0 ? this.scores[this.scores.length - 1] : 'N/A'}`, 500, 330); // Check if there are scores
//         ctx.restore();
//     }

//     handleUserCount() {
//         this.incrementTotalVisitCount(); // Increment the visit count on page load or game start
//     }
// }
class UserTracker {
  constructor() {
    this.users = this.getUserList();
    this.userID = this.getUserID();
    this.userName = this.getUserName() || this.promptForUserName();
    this.uniqueUserCount = this.getUniqueUserCount();
    this.totalVisitCount = this.getTotalVisitCount();
    this.sessionHandled = false; // To ensure the session is handled only once
    this.scores =
      JSON.parse(localStorage.getItem(`scores_${this.userID}`)) || [];

    this.handleUserSession();
  }
  // Method to handle user session and return a promise
  async handleUserSession() {
    if (this.sessionHandled) return true; // If already handled, resolve immediately
    this.sessionHandled = true; // Mark session as handled

    const continueAsExisting = confirm(
      "Do you want to continue as the existing user?"
    );

    if (continueAsExisting) {
      alert(`Welcome back, ${this.userName}!`);
    } else {
      this.handleNewUser();
    }
    this.incrementTotalVisitCount();
    return true; // Resolve the promise after session handling
  }

  // handleUserSession(startGameCallback) {
  //   const continueAsExisting = confirm(
  //     "Do you want to continue as the existing user?"
  //   );
  //   if (continueAsExisting) {
  //     alert(`Welcome back, ${this.userName}!`);
  //     this.incrementPlayCount();
  //   } else {
  //     this.handleNewUser();
  //   }
  //   // After the user session handling is complete, we invoke the callback to start the game
  //   startGameCallback();
  // }

  generateSimpleID() {
    return Date.now(); // Using timestamp for a more unique ID
  }

  getUserID() {
    let userID = localStorage.getItem("userID");
    if (!userID) {
      userID = this.generateSimpleID();
      localStorage.setItem("userID", userID);
    }
    return userID;
  }

  getUserName() {
    return localStorage.getItem("userName") || null; // Return null if userName doesn't exist
  }

  handleNewUser() {
    this.userID = this.generateSimpleID();
    this.userName = this.promptForUserName();
    localStorage.setItem("userID", this.userID);

    this.addNewUser(this.userID, this.userName);
    this.incrementUniqueUserCount();
  }

  addNewUser(userID, userName) {
    this.users.push({ userID, userName });
    this.saveUserList();
  }

  saveUserList() {
    localStorage.setItem("userList", JSON.stringify(this.users));
  }
  getUserList() {
    return JSON.parse(localStorage.getItem("userList")) || [];
  }
  addScore(score) {
    this.scores.push(score);
    localStorage.setItem(`scores_${this.userID}`, JSON.stringify(this.scores));
  }

  promptForUserName() {
    let userName = prompt("Please enter your name:", "Guest");
    while (!userName || userName.trim() === "") {
      alert("Name cannot be empty. Please enter your name:");
      userName = prompt("Please enter your name:", "Guest");
    }
    localStorage.setItem("userName", userName);
    return userName;
  }

  getUniqueUserCount() {
    return Number(localStorage.getItem("uniqueUserCount")) || 0;
  }

  getTotalVisitCount() {
    return Number(localStorage.getItem("totalVisitCount")) || 0;
  }

  getPlayCount() {
    return Number(localStorage.getItem("gameCount")) || 0;
  }

  // incrementPlayCount() {
  //   let gameCount = this.getPlayCount();
  //   gameCount++;
  //   localStorage.setItem("gameCount", gameCount);
  //   this.gameCount = gameCount;
  //   this.saveUserList();
  // }

  incrementUniqueUserCount() {
    let uniqueUserCount = this.getUniqueUserCount();
    uniqueUserCount++;
    localStorage.setItem("uniqueUserCount", uniqueUserCount);
    this.uniqueUserCount = uniqueUserCount;
  }

  incrementTotalVisitCount() {
    let totalVisitCount = this.getTotalVisitCount();
    totalVisitCount++;
    localStorage.setItem("totalVisitCount", totalVisitCount);
    this.totalVisitCount = totalVisitCount;
  }

  drawVisitCount(ctx) {
    ctx.save();
    ctx.textAlign = "center";
    ctx.fillStyle = "black";
    ctx.font = "24px Arial";
    ctx.fillText(`Player Name : ${this.userName}. `, 500, 260);
    ctx.fillText("Total Visits: " + this.totalVisitCount, 500, 280);
    ctx.fillText("Unique Users: " + this.uniqueUserCount, 500, 300);
    ctx.fillText(
      `Latest Score: ${
        this.scores.length > 0 ? this.scores[this.scores.length - 1] : "N/A"
      }`,
      500,
      320
    );
    ctx.restore();
  }

  getAllUsers() {
    console.log("User List:", this.users);
    return this.users;
  }
  handleUserCount() {
    this.incrementTotalVisitCount(); // Increment the visit count on page load or game start
  }
}



