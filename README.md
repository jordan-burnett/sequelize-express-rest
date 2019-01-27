## List

The list endpoint is used for returning a collection of objects from the database.

**Example request:**

`HTTP GET /users`

**Example response:**

```
{
    "total": "2",
    "results": [{
        "id": 1,
        "name": "John Smith",
        "age": 21,
    },{
        "id": 2,
        "name": "Sarah Jones",
        "age": 32,
    }]
}
```

### Filters

Results may be filtered based on model attributes by passing the attribute name as a query paramater. 


> **Example**

> `HTTP GET /users?age=30&city=London` 

> Returns all users whose age is 30 *and* whose location is set to London

More complex filters can be built using Sequelize's built in search operators.  These are defined in the search paramaters by using square bracket notation.  

> **Example**
> 
> `HTTP GET /users/?age[gt]=20&age[lt]=50`
> 
> Returns all users between the ages of 20 and 50

You can read more about Sequelize's built in operators [here](http://docs.sequelizejs.com/manual/tutorial/querying.html#operators)

### Fields

You can specify only subset of fields to return in the response by passing a comma seperated list of attributes via the **fields** query parameter.  

> **Example**
> 
> `HTTP GET /users?fields=id,age` 
> 
> Omits all other fields and only returns the *id* and *age* for each user

### Ordering

You can order results by one or more model attributes by passing a comma sepearated list of values to the **orderBy** query parameter. By default, results are returned in ascending order, however to sort in the opposite direction you should prefix the attribute name with a minus (-) symbol.  

> **Example**
> 
> `HTTP GET /users?orderBy=age` 
> 
> Returns a list of users, youngest first.
> 
> `HTTP GET /users?orderBy=-age` 
> 
> Returns a list of users, oldest first.

When specifying multiple order fields, ordering will occur from left to right. 

> **Example**
> 
> `HTTP GET /users?orderBy=age,name` 
> 
> Returns a list of users starting with the youngest.  Users with the same age > will be organised alphabetically by name.


### Paging

By default, the server will only return a maximum of 100 results. Larger datasets can be paged through by using the **limit** and **offset** query parameters.  **Offset** specifies the index of the first result to return, and **limit** specifies the number of results to return in that request (if available).  

The server always provides the total number of results that match the search query in the response.  This value can be used in combination with the limit and offset parameters to build a complete paging solution.

> **Example**
> 
> `HTTP GET /users?limit=10` 
> 
> Returns the first 10 users
> 
> `HTTP GET /users?offest=10&limit=20` 
> 
> Returns the next 10 users

### Create middleware

```list(model: Model, options: ListOptions)```

Returns an middleware function that 
###ListOptions
Configuration options accepted by the list middleware, along with their default values.

|Field|Description|Default Value|
|---|---|---|
|**defaultOrderBy**<br />String|Default value for the 'orderBy' query paramater if it is not provided by the user.|null|
|**defaultLimit**<br />Number|Default value for the 'limit' query paramater if it is not provided by the user|100|
|**maxLimit**<br />Number|The maximum number of results that can be returned in a single request.  Setting this to *null* will remove the limit and allow the user to return all records in a single request.|100|
|**filterWhitelist**<br />String[]|A list of filter parameters to accept.  ie. `['age', 'age[gt]', 'age[lt]']`.<br /><br />For convenience, you can allow all operators for a single attribute by using the `[*]` wildcard, ie.`['age[*]']`.<br/><br/>If no value is provided, the user will be able to filter using all allowed operations on all fields.|null|
|**opWhitelist**<br/>String[]|A list of allowed operators when using the wildcard matching in **filterWhitelist**, or when no filter whitelist is defined.<br /><br />These values will take precedence over any explicitly specified filters defined above, so if you allow `age[gt]` in **filterWhitelist**, `gt` must also be included in **opWhitelist**.<br/><br/>If no value is provided the user will be able to filter based on any Sequelize operator.|null|
|**fieldWhitelist**<br/>String[]|A list of allowed fields the user is allowed to specify via the **field** query parameter.  Any additional fields will be ignored.<br /><br />The default parse function will use this value to omit any additional fields from the response, so it can be used to ensure sensitive information is never exposed to third parties.|null|
|**orderWhitelist**<br/>String[]|List of model attributes the user is allowed to filter by.  If empty, the user may filter by any model attribute.|null|
|**resolve**<br/>Function(model: Model, queryOpts: Object)|Override the method that fetches results from the database. The default resolver function simply calls `Model.findAndCountAll()` which should be sufficient for most models.<br /><br />This method recieves two arguments, the Sequelize Model for this endpoint and the query options ready to be passed to `Model.findAndCountAll()`.<br /><br />It should return an object or a promise for an object with the same signature as `Model.findAndCountAll()` containing the total number of results (*count*) and an iterable list of model instances (*rows*).|defaultResolver()|
|**parse**<br/>Function(resolveResponse: Object, fieldWhitelist: String[])|Override the default parsing function that formats the response of the resolver function into the JSON to be returned from the server.<br /><br />The default parser runs `model.toJSON()` on each row returned from the database and omits any fields not included in **fieldWhitelist** (if specified).|defaultParser()|