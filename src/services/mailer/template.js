


module.exports=`
<!DOCTYPE html>
<html>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<head>
<style>
.description {
  text-align: justified;
}
.btn-group button {
  background-color: #C2185B; /* Accent background */
  border: 1px solid green; /* Green border */
  color: white; /* White text */
  padding: 10px 24px; /* Some padding */
  cursor: pointer; /* Pointer/hand icon */
  float: left; /* Float the buttons side by side */
}
/* Clear floats (clearfix hack) */
.btn-group:after {
  content: "";
  clear: both;
  display: table;
}
.btn-group button:not(:last-child) {
  border-right: none; /* Prevent double borders */
}
/* Add a background color on hover */
.btn-group button:hover {
  background-color: #C2185B;
}
table{
width:100%;
}
th, td {
  padding: 15px;
  text-align: left;
}
table, th, td {
  border: 1px solid black;
  border-collapse: collapse;
}
table#t01 tr:nth-child(even) {
  background-color: #eee;
}
table#t01 tr:nth-child(odd) {
 background-color: #fff;
}
table#t01 th {
  background-color:#558b2f;
  color: white;
}
img {
border-radius: 50%;
}
</style>
</head>
<body>
<p style= "font-size:1vw; font-family: Arial, Helvetica, sans-serif;">
Greetings,
</p>
<h2 style="font-size:2vw; font-family: Arial, Helvetica, sans-serif;">

     {{content}}
<p style="font-size:1vw; font-family: Arial, Helvetica, sans-serif;">
Regards,<br/>

{{from}}
.
</p>
</body>
</html>`;
