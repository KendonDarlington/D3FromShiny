#Import libraries
library(shiny)
library(tidyverse)
library(jsonlite)

ui <- fluidPage(
    
    #Bring in the style sheet from the www folder
    tags$head(tags$link(rel = "stylesheet", type = "text/css", href = "style.css")),
    
    #Tell shiny what version of d3 we want
    tags$script(src='//d3js.org/d3.v3.min.js'),
    
    # App Title
    titlePanel("Average MPG By Vehicle Class and Manufacturer "),
    
    #Dropdown list with the vehicle classes  
    selectInput(inputId = "vehicleClass",
                label = 'Select a Vehicle Class',
                choices = c('','compact', 'midsize', 'suv', '2seater', 'minivan', 'pickup', 'subcompact'),
                selected = ''
    ),
    
    #The d3 graph
    uiOutput("d3")
)

server <- function(input, output, session) {
  
  #Lets look for changes in our vehicle class dropdown then crunch the data and serve it to D3
  observeEvent(input$vehicleClass, {
    
    #Use tidyverse to slice the data based on the drop down input
    dfMpg <- mpg %>% 
      filter(class == input$vehicleClass) %>% 
      group_by(manufacturer) %>% 
      mutate(avgCity = mean(cty)) %>% 
      select(manufacturer, avgCity) %>% 
      unique() %>% 
      rename(name = manufacturer, value = avgCity)
    
    #Convert the tibble to json
    jsonMpg <- toJSON(dfMpg, pretty=TRUE)
    
    #Send that json from the session to our javascript
    session$sendCustomMessage(type="jsondata",jsonMpg)
    
  }, ignoreNULL = FALSE,ignoreInit = FALSE)
  
  #This tells shiny to run our javascript file "script.js" and send it to the UI for rendering
  output$d3<- renderUI({
    HTML('<script type="text/javascript", src="script.js">  </script>')
  })
}
shinyApp(ui = ui, server = server)
