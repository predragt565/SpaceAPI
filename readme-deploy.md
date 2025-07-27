

## 📁 Project Structure when deployed from the Docker Hub image

```
📁SpaceAPI
    └── 📁 backend/ (deployed in Docker's internal environment)
        ├── 📁 data/
        │   └── planets.json  (copied to volume)
        │
        ├── 📁 docs/ (also copied to local ./backend folder)
        │   ├── SpaceAPI-creating-image-package.txt
        │   └── SpaceAPI-starting-the-servers-txt
        │
        ├── 📁 src/
        │   └── 📁 space/
        │       └── main.py
        │
        └── 📁 utilities/
            └── data_load_func.py
        
    ├── 📁 frontend/  (deployed in Docker's internal environment)
        ├── 📁 src/
        │   ├── 📁 assets/
        │   │   └── react.svg
        │   │
        │   ├── 📁 components/
        │   │   ├── AddPlanetForm.jsx
        │   │   ├── EditPlanetForm.jsx
        │   │   ├── PlanetCard.jsx
        │   │   └── PlanetList.jsx
        │   │
        │   ├── App.jsx
        │   ├── App.css
        │   ├── index.css
        │   └── main.jsx
        │
        └── index.html
    
    ├── 📁 installation/
        ├── docker-down.cmd
        ├── docker-extract.cmd
        ├── docker-restart.cmd
        └── dockerhubpull.cmd
    │
    ├── .env (auto-generated) 
    ├── docker-compose-deploy.yml
    └── readme.md 
```

