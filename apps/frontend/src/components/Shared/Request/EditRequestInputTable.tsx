// edit process input arguments should be saved as:  [{currentVersion: "", proposedVersion: ""}]. change both where this is saved and where it's consumed in execute action

// create graphql type on request for editProcessChanges with this shape: // [{name: "", id: "", changes: [{field: "enum", old: "", new: ""}]}]

// Backend in request resolver's editProcessChanges field --> if edit, use function that, terates through array, does diff on the processVersions just comparing IDs, do a query for whatever has changes, and outputs result in change format

// on FE, iterate through Fields, display each (maybe doing some kind of transformation on each to get it into formstate view)
