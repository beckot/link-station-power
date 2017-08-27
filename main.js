/*

1. Add any number of link station coordinates.
2. Enter device location p
3. For each link station coordinate q
    3a. calculate the distance between p and q
    3b. if the distance > link station reach, skip this station.
    3c. otherwise 
        3c1. calculate power using the power formula. 
        3c2. add the q coordinates and calculated power to resultset array.
4. Print results:
    4a. If array is empty → print “No link station within reach for point x,y”
    4b. If array is non-empty:
        4b1. sort by power
        4b2. print 

*/

// 

