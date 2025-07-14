Assignment

1. Our user does not care about any ID's, only useful names, described by "DisplayName". The API's however only work with ID's.

2. Our user is expected to work with only one DataSet at a given time, and has no need for viewing multiple datasets simultaniously.

3. Our user expects to select exactly one grouping to use for the data

4. Our user expects to select at least one analytic for the data

5. Our user expects to see always the latest data at the time of using the application, but does not care if the data is updated while using the application.

6. Our user expects to view a table, where each node has the name of the node, as well as the analytic results.

7. Our user is interested ONLY in the nodes where at least one analytic could be calculated.

8. Individual nodes are identified by their ID (see ID field of both grouping nodes and calculate endpoints.

#NOTE
Please also note that while calculations are simulated, there is a delay of calculating analytics, simulated through Thread.Sleep. (Also note: Running the application should lead you to a site with sample output of the different API's)
