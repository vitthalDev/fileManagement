there are mainly 5 APIs for handeling the file in this project

1. /upload/single: this API uploads a single file in uploads directory, the size of the file should be less than 5 mb and following file formats are supported ".jpg", ".jpeg", ".png", ".pdf", ".stl".

2. /ulpoad/large: this API is used to upload a single file larger than 5 mb. Since this uses streaming the main file handeling part is done by inbuild node JS moulde fs instead of using multer as middleawrare.
This acceptes any type of file 

3. /upload/multipe: this API is similar to /upload/single additionaly it can accepts atmost 10 files to be uploaded in the uploads directory at a given time

4. /delete/:fileName: As the name suggests this API is used to delete("remove") a file from uploads directory. To remove a file you have pass the fil ename along with file extention in the query params of this API

5. /list: This API is used to fetch file information, you have to pass the file name along with file extention in req.body in JSON format for fetching file information. Also the file should be present in the directory for this API to work

// Folder Structure

The code is divided in following folder structure to provide concise readibility 

>node_modules
>src
  >controller
    -uploadController.js
  >routes
    -routes.js
  >services
    -fileHandler
  >utils
    -logs.json
    -util.js
  >uploads
  -index.js
  -package.json


// Curl for each API

- /delete/:fileName

curl  -X DELETE \
  'http://localhost:3000/delete/fileName' \
  --header 'Accept: */*' \
  --header 'User-Agent: Thunder Client (https://www.thunderclient.com)'


- /list

curl  -X GET \
  'http://localhost:3000/list' \
  --header 'Accept: */*' \
  --header 'User-Agent: Thunder Client (https://www.thunderclient.com)' \
  --header 'Content-Type: application/json' \
  --data-raw '{
  "fileName": "fileName.pdf"
}'


- /upload/single

curl  -X POST \
  'http://localhost:3000/upload/single' \
  --header 'Accept: */*' \
  --header 'User-Agent: Thunder Client (https://www.thunderclient.com)' \
  --form 'file=@c:\Users\sanje\Downloads\fileName.pdf'


- /upload/large

curl  -X POST \
  'http://localhost:3000/upload/large' \
  --header 'Accept: */*' \
  --header 'User-Agent: Thunder Client (https://www.thunderclient.com)' \
  --form 'file=@c:\Users\sanje\Downloads\fileName.pdf'


- /upload/multiple

curl  -X POST \
  'http://localhost:3000/upload/multiple' \
  --header 'Accept: */*' \
  --header 'User-Agent: Thunder Client (https://www.thunderclient.com)' \
  --form 'file=@c:\Users\sanje\Downloads\fileName.pdf' \
  --form 'file=@c:\Users\sanje\Downloads\fileName.pdf'


Note: You can see the log output of every file in utils/logs.json for additional debugging of the APIs