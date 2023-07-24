const { createApi } = require("unsplash-js");
const faker = require("faker");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

// Function to generate a random integer between min (inclusive) and max (inclusive)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to format a Date object as timestampz format
function formatTimestampz(date) {
  return date.toISOString().replace("T", " ").replace("Z", "+00");
}

// Function to fetch 20 random image URLs from Unsplash using unsplash-js SDK
async function getRandomImageUrls() {
  try {
    const unsplash = createApi({
      accessKey: "o1wO09nXX1ye52fNt1NyW4yZYSEh7SQxJDThPAyDobY", // Replace with your actual Unsplash access key
    });

    const randomPhotos = await unsplash.photos.getRandom({
      count: 20,
    });

    return randomPhotos.response.map((photo) => photo.urls.regular);
  } catch (error) {
    console.error("Error fetching images:", error.message);
    return [];
  }
}

// Function to generate fake posts
async function generateFakePosts(numPosts) {
  const imageUrls = await getRandomImageUrls();
  const posts = [];

  for (let i = 0; i < numPosts; i++) {
    const createdAt = faker.date.recent();
    const imageUrl = imageUrls[i % imageUrls.length]; // Loop through the imageUrls array using modulo
    const post = {
      id: i + 1, // Use row number as ID (starting from 1)
      created_at: formatTimestampz(createdAt),
      title: faker.lorem.sentence(),
      body: faker.lorem.paragraphs(),
      image: imageUrl,
      username: faker.internet.userName(),
      subreddit_id: getRandomInt(1, 4),
    };

    posts.push(post);
  }

  return posts;
}

const numPostsToGenerate = 20;
generateFakePosts(numPostsToGenerate).then((fakePosts) => {
  // Define the CSV file writer
  const csvWriter = createCsvWriter({
    path: "fake_posts.csv",
    header: [
      { id: "id", title: "id" },
      { id: "created_at", title: "created_at" },
      { id: "title", title: "title" },
      { id: "body", title: "body" },
      { id: "image", title: "image" },
      { id: "username", title: "username" },
      { id: "subreddit_id", title: "subreddit_id" },
    ],
  });

  // Write the fake posts to the CSV file
  csvWriter
    .writeRecords(fakePosts)
    .then(() => console.log("CSV file was successfully written with fake posts."))
    .catch((error) => console.error("Error writing CSV:", error.message));
});
