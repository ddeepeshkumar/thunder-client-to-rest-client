# Thunder-Client to Rest-Client

If you are unable to access Thunder-Client because of a paid membership plan and feel like all your work is lost, you are not the only one.
In recent changes to Thunder-Client, they have decided to take the features behind a paywall. To continue using it, you'll need to either buy a subscription plan or relocate the test files from the git repo to a default folder.\
For people like me who would like to simply test the APIs without having to pay for subscriptions, there is another very popular VS Code extension with limited functionalities called [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client).

You can use this straightforward script to generate REST Client test-cases based on your Thunder-Client test-cases.\
This script generates `.http` files and create relevant environment settings which can be used by the REST Client extension.

## Migration Steps

### In Your Project Repo

1. Update VS Code and Thunder Client extension to the latest version.\
   This is because this script depends on separate collection and environment files released in Thunder Client v2.8.0 (Jun 27, 2023)
2. Open Thunder Client extension. (this is necessary for those who just updated VS Code and the extension, as this will trigger the migration to create new thunder-client files)

### In this repo

1. Clone/Download this repo.
2. Copy the contents in `thunder-tests` from your project to the `input` folder in this project.\
   The input folder should look like this:

```
.
└── input/
    ├── collections/
    │   └── all the tc_col_*.json files
    └── environments/
        └── all the tc_env_*.json files
```

3. Run `node .`\
   This will generate the required files in the `output` folder which will look like this:

```
.
└── output/
    ├── settings.json
    └── rest-client/
        └── all the *.http files
```

4. Copy the content of the `settings.json` file into your project's `./.vscode/settings.json` folder.
5. Copy the rest-client folder to the root of your project (or wherever you would prefer it).

Your migration is complete.

Install the **REST Client** extension and we can start using the `.http` files for running the tests.

### Limitation

- This script only supports `application/json` requests.
- Support for other type of request will be added shortly.

#### Note:

Sometimes it is possible that an environment is not selected by default for REST Client in which case APIs may not get executed.\
To fix this you can select an environment from the following two places:

- Bottom right side of the status bar.
- `Ctrl+Shift+P` **Rest Client: Switch Environment**
