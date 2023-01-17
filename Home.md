Limelight is a tool for product managers and engineers at Mozilla to help design messages for the Firefox Messaging System.

# Making Changes to this Wiki

1. Clone the Limelight repository:

```
git clone git@github.com:mozilla/limelight.git
cd limelight
```

2. Create a new branch based on the `wiki` branch:

```
git checkout origin/wiki -b dev/wiki/my-changes
```

3. Commit your changes and push them to review, merging into the `wiki` branch.

4. Once reviewed and merged, a repository admin will push the changes to the wiki repository.

## For repository admins:

### Add the wiki remote

To publish to the wiki, you need to add the repository as a git remote.

```
git remote add wiki git@github.com:mozilla/limelight.wiki.git
```

### Publishing the `wiki` branch

Once a pull request against the `wiki` branch has merged, you have to push to the `wiki` upstream.

```
git push wiki wiki:master
```

In the future this will be done automatically by a GitHub Action.
