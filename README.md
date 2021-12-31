<p align="center">
<img src="./Images/ScanLens-logo.png" alt="Logo of the project" width="350">
</p>

<p align="center">
AI-empowered web-based applicatoin for Intracranial Hemorrhage (ICH) Detection using CT scans
</p>

<p align="center">
<img src="https://img.shields.io/badge/contributors-4-orange.svg?style=soft-square" alt="Contributers"/>
<img src="https://img.shields.io/badge/-ReactJs-61DAFB?logo=react&logoColor=white&style=flat" alt="Reactjs"/>
<img src="https://img.shields.io/badge/-Django-092E20?logo=django&logoColor=white&style=flat" alt="Django"/>
<img src="https://img.shields.io/badge/-npm%20v6.14.13-CB3837?logo=npm&logoColor=white&style=flat" alt="npm"/>
<img src="https://img.shields.io/badge/-Common Clauses License-000000" alt="npm"/>
</p>

<p align="center">

## ScanLens Aims to Assist Radiologists to Detect ICH
* Hemorrhage Classification to the 5 subtypes (using CNN)
* Hemorrhage Segmentation
</p>

<img src="./Images/objectives.png" alt="" width="100%"/>
<p align="center">
<small align="center" >Project Objectives</small>
</p>

## Tour
<img src="./Images/tour.gif" alt="" width="100%"/>
<p align="center">
<small align="center" >ScanLens Tour</small>
</p>

## Get Started 

1. **Create new python environment and install dependencies:**

    a. *Option 1:* using pip <br>
        ```python -m venv venv```<br>
        ```pip install -r requirements.txt```
    
    b. *Option 2:* using anaconda <br>
        ```python -m venv venv```<br>
        ```conda install --file requirements.txt```

2. **Start the Django web server from `backend` directory**
    
    ```cd backend ```<br>
    ```python manage.py runserver```

3. **Open a new terminal and start the node server in `frontend` directory**
(If you don't have `npm` installed, you can install it from [here](https://nodejs.org/en/))

    ```cd frontend ```
    
    ``` npm install```     (only if this is your first time to use the app)
    
    ``` npm start```

**Note:** If you want the trained CNN models, you can contact us at [this email](mailto:inesalriahi@gmail.com)


## Context and Problem Statement
Intracranial hemorrhage or ICH is bleeding that occurs inside the brain or skull. It’s a serious condition and requires urgent treatment and accurate diagnosis, otherwise, delay in treatment or miss-diagnosing can cause severe side effects. Based on the location of the hemorrhage, ICH is divided into five subtypes which are intraparenchymal, intraventricular, subarachnoid, subdural, and epidural.
If a stroke due to brain bleeding has occurred, the cause must be determined so that the appropriate treatment can be started. Prompt medical treatment can help limit damage to the brain, which will improve your chances of recovery. However, identifying the location and type of any bleeding present is a critical step in the treatment of the patient. The process of examining CT scans of the patient's skull for the presence, location, and type of bleeding requires highly trained specialists and is often complicated and time-consuming.
    
<img src="./Images/ICH_subtypes.png" alt="" width="100%"/>
<p align="center">
<small align="center" >Intracranial Hemorrhage Subtypes</small>
</p>


## Method
Our approach consists of two main parts. The first part aims to perform region growing-based image segmentation to segment the damaged region of the brain, extracts biomarker features using the PyRadiomics package and compute the histogram distribution from the intensity of the segmented region. The second part aims to develop a CNN model to predict the abnormality from the CT scan images. On top of this, a Multi-label CNN Model is developed to predict the probabilities of the subtype(s) if an abnormality is discovered. Finally, the classified images are  analyzed visually using the GradCam tool. A web application is also created with ReactJS on the front end, Django on the back end and REST API for communication between the front and back ends to assist the clinician in the analysis of CT scan images.

## Impact
The project provides an employable solution for radiologists to assess in diagnosing and treating Intracranial Hemorrhage with a simple web application.The project enhances the medical procedure to treat Intracranial hemorrhage and accelerates the diagnosis process.

## Authors
<table>
<tr>
<td align="center"><a href="https://github.com/inesriahi"><img src="https://github.com/inesriahi.png" width="50px;" alt=""/><br /><sub><b>Ines<br/>Riahi</b></sub></td>
<td align="center"><a href="https://github.com/Shidhani"><img src="https://github.com/Shidhani.png" width="50px;" alt=""/><br /><sub><b>Aafaq<br/>Al Shidhani</br></sub></td>
<td align="center"><a href="https://github.com/maimuna99"><img src="https://github.com/maimuna99.png" width="50px;" alt=""/><br /><sub><b>Maimoona<br/>Al Wahaibi</br></sub></td>
<td align="center"><a href="https://github.com/Nuha28"><img src="https://github.com/Nuha28.png" width="50px;" alt=""/><br /><sub><b>Nuha<br/>Al Rasbi</br></sub></td>
</table>