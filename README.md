# mincer

modular data parser library for JS and TS applications

## note

This project uses a highly object oriented approach for reading files and folders that should be in a desired organization / structure. For example, a `posts/` folder with `.md` files with any name and a `event/` folder subfolders that contain several files for describing an event. This type of structure can be described with this project and easily collected into a javascript object.

I honestly don't know if this is something that would ever be useful, considering it lacks many convenience features and simpler options are easier to code, but I thought it would be a cool experiment. Some useful features like schemas for files that warn when actual data in a file is missing or malformed, the ability to add methods to the objects that are returned, and overall nicer typedefs to reduce code size.
