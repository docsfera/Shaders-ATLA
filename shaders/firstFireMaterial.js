const firstFireVertexShader = `
    uniform float uTime; 
    uniform float uFrequency;
    uniform float uScaleY;
    varying vec2 vUv;
    varying vec3 vPosition;
    varying float vNoise;



    float pseudoRandom(float seed) {
        return fract(sin(seed) * 43758.5453);
    }

    float noise(vec3 point) {
        float dt = dot(point, vec3(12.9898, 78.233, 123.45));
        float sn = (sin(dt) * 43758.5453123);
        return fract(sn);
    }
                




    void main() {
        vUv = uv;                   

        // Пламенная анимация
        float noiseFactor = noise(position + uTime);
        vec3 pos = position * 0.3;
        pos.x = pos.x * 0.5;
        pos.y = pos.y * uScaleY;
                    
        // Манипулирование вершинами на конце (вдоль положительного Y)
        if (pos.y > uFrequency) {
            pos.x += sin(uTime + pos.y) * (noiseFactor - 0.5) * 5.0;
            pos.y += noiseFactor * 5.0;
            pos.z += cos(uTime + pos.y) * (noiseFactor - 0.5) * 5.0;
        }

        pos.x +=sin(.3 * pos.y + uTime*20.0) * 0.05;

        vNoise = noiseFactor * 1.5;
		vPosition = position;

        vec3 displacedPosition = pos * vec3(1.5, 8.0, 1.5);
                    
        gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedPosition, 1.0);
    }
`


const firstFireFragmentShader = `
                uniform float uTime; 
                varying vec2 vUv;
                varying float vNoise;
                varying vec3 vPosition;

                float random (vec2 st) {
                    return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123 * abs(sin(uTime)));
                }
                void main() {

                    float rnd = random( vUv );

                    // Высота относительно центра огня
                    float heightFactor = smoothstep(0.0, 30.0, vPosition.y);

                    // Определяем цвета для эффекта пламени
                    vec3 colorBottom = vec3(1.0, 1.0, 0.0); // Желтый
                    vec3 colorMiddle = vec3(1.0, 0.5, 0.0); // Оранжевый
                    vec3 colorTop = vec3(1.0, 0.0, 0.0); // Красный

                    // Смешиваем цвета, используя шум и высоту для создания эффекта пламени
                    vec3 color = mix(colorBottom, colorMiddle, clamp(vNoise + 0.2, 0.0, 1.0));
                    color = mix(color, colorTop, heightFactor);

                    // Плавные переходы между цветами с точечным эффектом
                    color *= (1.0 - heightFactor) + vNoise * heightFactor;

                    gl_FragColor = vec4(color, 1.0);

                }
                `

export {firstFireVertexShader, firstFireFragmentShader}