const container = document.getElementById("container")
        const container_svg = document.getElementById("container_svg")
        const width = 400
        const height = 400

        let FPS = 60
        
        const points = []

        let point_radius = 30
        function CreatePoint(position, index){
            const div = document.createElement("div")
            div.innerHTML = index
            div.style.marginLeft = position[0] + "px"
            div.style.marginTop = position[1] + "px"
            div.style.width = point_radius + "px"
            div.style.height = point_radius + "px"
            div.classList.add("point")
            container.appendChild(div)

            points.push({"div": div, "position": [position[0] + point_radius/2, position[1] + point_radius/2]})
        }

        
        CreatePoint( [15, 15], 1 )
        CreatePoint( [width - point_radius*1.5, 15, 280], 2 )
        CreatePoint( [width - point_radius*1.5, height - point_radius*1.5], 3 )
        

        let total_lines = 20
        function CreateLine(position1, position2, index){
            const [x1, y1] = position1
            const [x2, y2] = position2
            const line = document.getElementById("line" + index)
            line.setAttribute("x1", x1)
            line.setAttribute("y1", y1)
            line.setAttribute("x2", x2)
            line.setAttribute("y2", y2)
            line.style.stroke = "rgb(255, 0, 0)"
            line.style.strokeWidth = "2"
            container_svg.appendChild(line)
        }

        function SetLine(index, position1, position2){
            const [x1, y1] = position1
            const [x2, y2] = position2
            const line = document.getElementById("line" + (index))
            line.setAttribute("x1", x1)
            line.setAttribute("y1", y1)
            line.setAttribute("x2", x2)
            line.setAttribute("y2", y2)
            line.style.stroke = "rgb(255, 0, 0)"
            line.style.strokeWidth = "2"
        }

        function Lerp(position1, position2, t){
            let new_position = []
            for (let i = 0; i < position1.length; i++){
                new_position.push( position1[i] + (position2[i] - position1[i])*t )
            }

            return new_position
        }

        for (let i = 0; i < total_lines; i++){
            CreateLine([0, 0], [0, 0], i)
        }

        let isMouseDraggingPoint = false
        let dragPoint = null

        
        function ApplyPointEvents(i){
            const div = points[i]["div"]
            div.addEventListener("mousedown", (e) => {
                dragPoint = i
                isMouseDraggingPoint = true
            })

            div.addEventListener("mouseup", (e) => {
                dragPoint = null
                isMouseDraggingPoint = false
            })
        }

        for (let i = 0; i < points.length; i++){
            ApplyPointEvents(i)
        }

        let mouseX = 0
        let mouseY = 0
        document.addEventListener("mousemove", (e) => {
            mouseX = e.clientX
            mouseY = e.clientY
        })

        document.getElementById("add_point").addEventListener(("click"), () => {
            let last_dot_position = points[points.length - 1]["position"]
            points[points.length - 1]["position"] = [0, 0]
            points[points.length - 1]["div"].style.marginLeft = 0 + "px"
            points[points.length - 1]["div"].style.marginTop = 0 + "px"
            CreatePoint([last_dot_position[0] - point_radius/2, last_dot_position[1] - point_radius/2], points.length + 1)
            ApplyPointEvents(points.length - 1)
        })

        const bezier_factor = document.getElementById("bezier_factor")

        setInterval(() => {
            let p0 = points[0]["position"]
            let end = p0

            let index = 0
            for (let t = 0 + 1/total_lines; t <= 1 + 1/total_lines/2 ; t += 1/total_lines){
                let current = end
                let start = current

                let f = bezier_factor.value || 1
                for (let i = 0; i < points.length; i++){
                    let pos = points[i]["position"]
                    if (i != 0 && i != points.length - 1){
                        pos = [pos[0]*f, pos[1]*f]
                    }
                    current = Lerp(current, pos, t)
                }

                end = current
                SetLine(index, start, end)
                index += 1
            }

            if (isMouseDraggingPoint && dragPoint != null){
                let comp = [mouseX - container.offsetLeft - point_radius/2, mouseY - container.offsetTop - point_radius/2]
                points[dragPoint]["div"].style.marginLeft = comp[0] + "px"
                points[dragPoint]["div"].style.marginTop = comp[1] + "px"
                points[dragPoint]["position"] = [comp[0] + point_radius/2, comp[1] + point_radius/2]
            }
        }, 1000*1/FPS)