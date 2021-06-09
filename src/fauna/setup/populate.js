import { QueryManager } from '../query-manager'
const { handleSetupError } = require('../helpers/errors')

// This function will:
// - Create a few users
// - Create a few tweets
async function populateSampleData(adminKey) {
  console.log(' ------- Populating Sample Data -------')
  try {
    // Let's create some users first
    console.log('1.  -- Creating three users')
    // Might error if run twice (users can only be created once with the same e-mail)
    let faunaQueries = new QueryManager(adminKey)
    await handleSetupError(
      faunaQueries.register('user1@test.com', 'testtest', 'Brecht', 'databrecht'),
      'register user1'
    )
    // register immediatley logs in the user and hence changes the key in faunaQueries, so we
    // recreate it each time.
    faunaQueries = new QueryManager(adminKey)
    await handleSetupError(
      faunaQueries.register('user2@test.com', 'testtest', 'Mary', 'logiconly219'),
      'register user2'
    )
    faunaQueries = new QueryManager(adminKey)
    await handleSetupError(
      faunaQueries.register('user3@test.com', 'testtest', 'Robert', 'smartstec193'),
      'register user3'
    )
    faunaQueries = new QueryManager(adminKey)
    await handleSetupError(
      faunaQueries.register('user4@test.com', 'testtest', 'Bart', 'catscatscats'),
      'register user4'
    )
    faunaQueries = new QueryManager(adminKey)

    // Let's create some fweets
    console.log('2.  -- Creating fweets')
    /** ****** CREATING FOR USER 1 ***********/
    await handleSetupError(faunaQueries.login('user1@test.com', 'testtest'), 'login user1')
    const fw1 = await handleSetupError(
      faunaQueries.createFweet('What do people do these days? #lockdown #corona #bored'),
      'create fweet 1'
    )
    // This we do not reset faunaQueries since it's intended to continue with the logged in
    // account's Identity.
    const fw2 = await handleSetupError(
      faunaQueries.createFweet('My best friend is debt free, and I want to be famous #randomtweet '),
      'create fweet 2'
    )

    await handleSetupError(faunaQueries.logout(), 'logout 1')
    /** ****** CREATING FOR USER 2 ***********/

    await handleSetupError(faunaQueries.login('user2@test.com', 'testtest'), 'login user2')
    const fw3 = await handleSetupError(
      faunaQueries.createFweet('Fauna, the distributed database created by engineers that helped scale twitter'),
      'create fweet 3'
    )
    const fw4 = await handleSetupError(
      faunaQueries.createFweet(`It's crazy how old the famous mascotte of the fwitter app has become`, {
        id: 'old_Dino_osx4za',
        url: 'https://res.cloudinary.com/dtkj34c6h/image/upload/v1584971195/old_Dino_osx4za.png',
        type: 'image',
        cloudName: 'dtkj34c6h'
      }),
      'create fweet 4'
    )

    await handleSetupError(faunaQueries.logout(), 'logout 2')
    /** ****** CREATING FOR USER 3 ***********/

    await handleSetupError(faunaQueries.login('user3@test.com', 'testtest'), 'login user3')
    const fw5 = await handleSetupError(
      faunaQueries.createFweet('Someone give me me one reason to use FaunaDB instead MySQL #mysql #fauna'),
      'create fweet 5'
    )
    const fw6 = await handleSetupError(
      faunaQueries.createFweet('How to build an application like twitter with APIs like FaunaDB and Cloudinary!'),
      'create fweet 6'
    )

    await handleSetupError(faunaQueries.logout(), 'logout 3')
    /** ****** CREATING FOR USER 4 ***********/

    await handleSetupError(faunaQueries.login('user4@test.com', 'testtest'), 'login user 4')
    const fw7 = await handleSetupError(
      faunaQueries.createFweet(
        'What do people generally do in time of crisis? Post pictures of cats #cats #lockdown #corona',
        {
          id: 'cat_sugzem',
          url: 'https://res.cloudinary.com/dtkj34c6h/video/upload/v1584971206/cat_sugzem.mp4',
          type: 'video',
          cloudName: 'dtkj34c6h'
        }
      ),
      'create fweet 7'
    )

    // Let's like some fweets and refweet and comment.
    console.log('3.  -- Like/Comment/Refweet')

    /** ****** REFWEETING/LIKING/COMMENTING FOR USER 4 ***********/
    await handleSetupError(faunaQueries.comment(fw2[0].fweet.ref, 'ehh, interesting insight!'), 'comment 1')
    await handleSetupError(faunaQueries.likeFweet(fw1[0].fweet.ref), 'like 1')
    const refw1 = await handleSetupError(
      faunaQueries.refweet(fw3[0].fweet.ref, `I've heard it's scalable, distributed, multi-region yet consistent?`),
      'refweet 1'
    )

    await handleSetupError(faunaQueries.logout(), 'logout 4')
    /** ****** REFWEETING/LIKING/COMMENTING FOR USER 2 ***********/

    await handleSetupError(faunaQueries.login('user2@test.com', 'testtest'), 'login user 2')

    await handleSetupError(
      faunaQueries.comment(
        fw5[0].fweet.ref,
        `Pick one 😎:
    - Multi-region
    - Distributed yet strongly consistent (ACID) with relations included
    - Built to scale
    - Pay as you go
    - Native GraphQL.
    - Built-in ABAC row-level security layer
    If you have specific questions, I'm happy to answer them`
      ),
      'comment 2'
    )

    await handleSetupError(faunaQueries.comment(fw7[0].fweet.ref, `Moar cats!`), 'comment 3')
    await handleSetupError(faunaQueries.likeFweet(fw7[0].fweet.ref), 'like 7')
    await handleSetupError(faunaQueries.likeFweet(fw6[0].fweet.ref), 'like 8')
    await handleSetupError(faunaQueries.likeFweet(fw1[0].fweet.ref), 'like 9')
    await handleSetupError(faunaQueries.likeFweet(fw2[0].fweet.ref), 'like 10')

    await handleSetupError(faunaQueries.logout(), 'logout 6')
    /** ****** REFWEETING/LIKING/COMMENTING FOR USER 3 ***********/

    await handleSetupError(faunaQueries.login('user3@test.com', 'testtest'), 'login user3')
    await handleSetupError(
      faunaQueries.comment(
        fw6[0].fweet.ref,
        `Soon we'll add an example with authorisation using serverless functions with Zeit/Nelitfy or Cloudflare`
      ),
      'comment 4'
    )
    await handleSetupError(faunaQueries.likeFweet(fw1[0].fweet.ref), 'like 2')
    await handleSetupError(faunaQueries.likeFweet(fw2[0].fweet.ref), 'like 1')

    await handleSetupError(
      faunaQueries.comment(fw6[0].fweet.ref, `And an example using Auth0 for authentication`),
      'comment 5'
    )
    await handleSetupError(faunaQueries.comment(refw1.refweet.fweet.ref, `Yes it is!`), 'comment 6')
    await handleSetupError(
      faunaQueries.comment(fw4[0].fweet.ref, `Wohah... time flies, even for dinosaurs`),
      'comment 7'
    )

    await handleSetupError(faunaQueries.logout(), 'logout 7')
    /** ****** REFWEETING/LIKING/COMMENTING FOR USER 2 ***********/
    await handleSetupError(faunaQueries.login('user2@test.com', 'testtest'), 'login user 2')
    await handleSetupError(faunaQueries.comment(fw4[0].fweet.ref, `Yep, it's crazy`), 'comment 8')
    await handleSetupError(faunaQueries.comment(fw7[0].fweet.ref, `Ooohhh.. cute!`), 'comment 9')
    await handleSetupError(faunaQueries.likeFweet(fw6[0].fweet.ref), 'like 3')
    await handleSetupError(faunaQueries.likeFweet(fw7[0].fweet.ref), 'like 4')

    console.log(`
    You can now login with these three users:
    - user1@test.com/testtest
    - user2@test.com/testtest
    - user3@test.com/testtest
    - user4@test.com/testtest
  `)
  } catch (err) {
    console.error('Unexpected error', err)
  }
}

export { populateSampleData }