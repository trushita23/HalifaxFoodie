// References: https://stackoverflow.com/a/63105373/8348987
const AWS = require("aws-sdk");
const fetch = require("node-fetch");

const document = new AWS.DynamoDB.DocumentClient();
const GCP_ACCESS_TOKEN_KEY = ""

// initializing all variables
const custParams = {
  TableName: "users",
};

const restaurantParams = {
  TableName: "restaurantInfo",
};

exports.handler = async (event, context) => {

  let res = {};

  try {
    let userRecords = await document.scan(custParams).promise();
    let restRecords = await document.scan(restaurantParams).promise();

    let intentInfo = event.sessionState.intent;
    let sessionAttr = event.sessionState.sessionAttributes;

    switch (intentInfo.name) {
      case "trackOrder":
        res = trackOrderIntent(userRecords, intentInfo);
        break;
      case "rateOrder":
        res = rateOrderIntent(userRecords, intentInfo);
        break;
      case "addNewRecipe":
        res = addNewRecipeIntent(restRecords, intentInfo, sessionAttr);
        break;
      case "staticNavigation":
        res = staticNavigationIntent(intentInfo);
        break;
      case "complaint":
        res = complaintIntent(intentInfo, context);
        break;
      default:
        break;
    }
  } catch (err) {
    console.log("Error in Lambda: ", err);
  }
  return res;
};

// intent one track order
function trackOrderIntent(userRecords, intentInfo) {
  let response = {};
  if (intentInfo.slots.email != null) {
    let inputEmailId = intentInfo.slots.email.value.originalValue;
    let user = userRecords.Items.find((item) => item.email === inputEmailId);
    if (user) {
      response = {
        sessionState: {
          dialogAction: {
            slotToElicit: "TrackFoodOrder", //Done
            type: "Delegate",
          },
          intent: {
            confirmationState: "Confirmed",
            name: "trackOrder",
            state: "Fulfilled",
          },
        },
        messages: [
          {
            contentType: "PlainText",
            content: "Your credentials have been successfully verified!", //Done
          },
        ],
      };
    }
  } else if (intentInfo.slots.email === null) {
    let orderNo = intentInfo.slots.TrackFoodOrder.value.originalValue;
    let orderDetails = userRecords.Items;
    const orderInfo = orderDetails.find((item) => {
      const foundOrder = item.orders?.find(orNo => orNo.orderNo == orderNo)
      return foundOrder ? true : false
    });
    if (orderInfo) {
      response = {
        sessionState: {
          dialogAction: {
            type: "Close",
          },
          intent: {
            confirmationState: "Confirmed",
            name: "trackOrder",
            state: "Fulfilled",
          },
        },
        messages: [
          {
            contentType: "PlainText",
            content: "Order Status: Preparing", //done
          },
        ],
      };
    }
  }
  return response;
}

//intent for rating order
async function rateOrderIntent(userRecords, intentInfo) {
  let response = {};
  if (intentInfo.slots.email != null) {
    let inputEmailId = intentInfo.slots.email.value.originalValue;
    let user = userRecords.Items.find((item) => item.email === inputEmailId);
    if (user) {
      response = {
        sessionState: {
          dialogAction: {
            slotToElicit: "orderNo", //Done
            type: "Delegate",
          },
          intent: {
            confirmationState: "Confirmed",
            name: "rateOrder",
            state: "Fulfilled",
          },
        },
        messages: [
          {
            contentType: "PlainText",
            content: "Your credentials have been successfully verified!", 
          },
        ],
      };
    }
  } else if (intentInfo.slots.email === null) {
    let orderNo = intentInfo.slots.orderNo.value.originalValue; 
    let rating = intentInfo.slots.rating.value.originalValue;

    const user = userRecords.Items.find((user) => {
      return user.orders.find((item) => item.orderNo == orderNo);
    });

    let userId = user?.email; 
    try {
      response = {
        sessionState: {
          dialogAction: {
            type: "Close",
          },
          intent: {
            confirmationState: "Confirmed",
            name: "rateOrder",
            state: "Fulfilled",
          },
        },
        messages: [
          {
            contentType: "PlainText",
            content: "Thank you. Your rating is saved.", 
          },
        ],
      };
      await storeRating(rating, orderNo, userId, user); 
    } catch (err) {
      console.log("Error in Rating:", err);
    }
  }
  return response;
}

async function addNewRecipeIntent(restRecords, intentInfo, sessionAttr) {
  let response = {};
  const restInfo = {
    restName: "",
    restMenu: [],
    email: "",
  };
  const recipeInfo = {
    name: "",
    ingredients: "",
    price: "",
  };

  if (intentInfo.slots.email != null) {
    let inputEmailId = intentInfo.slots.email.value.originalValue;
    let rest = restRecords.Items.find((item) => item.email === inputEmailId);
    if (rest) {
      response = {
        sessionState: {
          sessionAttributes: {
            email: inputEmailId,
          },
          dialogAction: {
            slotToElicit: "name",
            type: "Delegate",
          },
          intent: {
            confirmationState: "Confirmed",
            name: "addNewRecipe",
            state: "Fulfilled",
          },
        },
        messages: [
          {
            contentType: "PlainText",
            content: "Your credentials have been successfully verified!",
          },
        ],
      };
    }
  } else if (intentInfo.slots.email === null) {

    let email = sessionAttr.email;

    let rest = restRecords.Items.find((item) => item.email === email);
    restInfo.restName = rest.restName; 
    restInfo.restMenu = rest.restMenu; 
    restInfo.email = email;


    recipeInfo.name = intentInfo.slots.name.value.originalValue; 
    recipeInfo.ingredients = intentInfo.slots.ingredients.value.originalValue; 
    recipeInfo.price = intentInfo.slots.price.value.originalValue; 
    if (rest) {
      try {
        response = {
          sessionState: {
            dialogAction: {
              type: "Close",
            },
            intent: {
              confirmationState: "Confirmed",
              name: "addNewRecipe",
              state: "Fulfilled",
            },
          },
          messages: [
            {
              contentType: "PlainText",
              content: "Thank you. Your recipe is saved.",
            },
          ],
        };
        await storeRecipe(restInfo, recipeInfo);
      } catch (err) {
        console.log("Error in save recipe:", err); 
      }
    }
  }
  return response;
}

async function storeRating(rating, orderNo, userId, userDetails) {
  let orderList = userDetails.orders
  let index = orderList?.findIndex((obj => obj.orderNo == orderNo));
  orderList[index].rating = parseInt(rating);
  // let updateParams = {
  //   TableName: "users",
  //   Key: {
  //     email: userId,
  //   },
  //   UpdateExpression: "set orders = :r",
  //   ExpressionAttributeValues: {
  //     ":r": {
  //       orderNo: orderNo,
  //       orderStatus: "preparing",
  //       rating: parseInt(rating),
  //     },
  //   },
  //   ReturnValues: "UPDATED_NEW",
  // };
  let updateParams = {
    TableName: "users",
    Key: {
      email: userId,
    },
    UpdateExpression: "set orders = :r",
    ExpressionAttributeValues: {
      ":r": orderList,
    },
    ReturnValues: "UPDATED_NEW",
  };
  let data;
  try {
    data = await document.update(updateParams).promise();
  } catch (err) {
    console.log("Error in saving rating:", err); //done
  }
  return data;
}

async function storeRecipe(restInfo, recipeInfo) {
  restInfo.restMenu.push({
    recId: Math.floor(Math.random() * 10000),
    ...recipeInfo,
  });
  let restParams = {
    TableName: "restaurantInfo",
    Item: {
      ...restInfo,
    },
  };
  let data;
  try {
    data = await document.put(restParams).promise();
  } catch (err) {
    console.log("Promise Error in Saving Recipe:", err);
  }
  return data;
}

function staticNavigationIntent(intentInfo) {
  const response = {
    sessionState: {
      dialogAction: {
        type: "Close",
      },
      intent: {
        confirmationState: "Confirmed",
        name: "staticNavigation",
        state: "Fulfilled",
      },
    },
    messages: [
      {
        contentType: "PlainText",
      },
    ],
  };
  const slotValue = intentInfo.slots.navWebsite.value.originalValue;
  switch (slotValue?.toLowerCase()) {
    case "login":
      response.messages[0].content = "http://localhost:3000/login";
      break;
    case "register":
      response.messages[0].content = "http://localhost:3000/register";
      break;
    default:
      break;
  }
  return response;
}


async function complaintIntent(intentInfo, context) {
  let restaurantName = intentInfo.slots.restaurantName.value.originalValue;
  let custemail = intentInfo.slots.email.value.originalValue;
  let custName = intentInfo.slots.custName.value.originalValue;
  let restaurantEmail = await fetchRestaurantDetails(restaurantName)

  return publishMessage(
    custemail,
    custName,
    restaurantName,
    restaurantEmail,
    context.awsRequestId
  );
}

async function fetchRestaurantDetails(restaurantName) {
  let restList = await document.scan(restaurantParams).promise();
  let restaurantEmail = restList.Items.find((item) => item.restName?.toLowerCase() == restaurantName?.toLowerCase())?.email;
  return restaurantEmail;
}


async function publishMessage(custemail,
  custName,
  restaurantName,
  restaurantEmail,
  chatSessionID) {
  const payload = {
    attributes: {
      customerEmail: custemail,
      customerName: custName,
      restaurantEmail: restaurantEmail,
      restaurantName: restaurantName,
      chatSessionID: chatSessionID
    }
  };

  const access_token = GCP_ACCESS_TOKEN_KEY;
  const topic = 'projects/serverless-fall/topics/customer_complaints'

  await fetch('https://pubsub.googleapis.com/v1/' + topic + ':publish', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + access_token,
      'Content-Type': 'application/json'
    },
    body: '{"messages":[{"data":"' + Buffer.from(JSON.stringify(payload)).toString('base64') + '"}]}'
  }).then(res => res.json()).then(res1 => console.log("Recieved the prediction label", res1));


  let response = {
    sessionState: {
      dialogAction: {
        type: "Close",
      },
      intent: {
        confirmationState: "Confirmed",
        name: "complaint",
        state: "Fulfilled",
      },
    },
    messages: [
      {
        contentType: "PlainText",
        content:
          `Open this link: https://g16project-iffhrwp6xq-uc.a.run.app/chat?sessionId= ` +
          chatSessionID,
      },
    ],
  };

  return response;
}
