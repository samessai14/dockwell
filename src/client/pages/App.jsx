import axios from 'axios';
import React, { useEffect, useState } from 'react';
import SystemMetrics from '../containers/SystemMetrics.jsx';
import Environments from '../containers/Environments.jsx';
import Carousel from '../containers/Carousel.jsx';
import Logs from '../containers/Logs.jsx';
import LiquidGauge from '../components/LiquidGauge.jsx';

const App = () => {
  const [queryData, setQueryData] = useState({});
  //filters running containers
  const [allContainers, setAllContainers] = useState([]);
  const [activeContainers, setActiveContainers] = useState([]);
  const [loadingScreen, setLoadingScreen] = useState(true);

  const getStatsFunc = () => {
    axios
      .get('/api/getStats')
      .then((res) => {
        setQueryData((prev) => {
          const newQueryState = { ...prev };
          for (let key in res.data) {
            if (!(key in newQueryState)) {
              newQueryState[key] = res.data[key];
            } else if (
              key !== 'totals' &&
              newQueryState[key].State === 'running' &&
              newQueryState[key].cpu &&
              newQueryState[key].memory &&
              res.data[key].cpu &&
              res.data[key].memory
            ) {
              newQueryState[key].State = res.data[key].State;
              newQueryState[key].Status = res.data[key].Status;
              newQueryState[key].Ports = res.data[key].Ports;
              newQueryState[key].memory.time = [
                ...prev[key].memory.time,
                ...res.data[key].memory.time,
              ];
              newQueryState[key].memory.value = [
                ...prev[key].memory.value,
                ...res.data[key].memory.value,
              ];
              newQueryState[key].cpu.time = [
                ...prev[key].cpu.time,
                ...res.data[key].cpu.time,
              ];
              newQueryState[key].cpu.value = [
                ...prev[key].cpu.value,
                ...res.data[key].cpu.value,
              ];
            } else {
              //update all keys' values (these shouldn't have metrics)
              newQueryState[key] = res.data[key];
            }
          }

          return newQueryState;
        });
      })
      .catch((err) =>
        console.error('Initial fetch GET request to DB: ERROR: ', err)
      );
    return getStatsFunc;
  };

  useEffect(() => {
    //tell it to repeat
    setInterval(getStatsFunc(), 1000);
  }, []);

  useEffect(() => {
    const allContainers = [];
    const activeContainers = [];
    for (const key in queryData) {
      if (key !== 'totals') {
        allContainers.push(queryData[key]);
        if (
          queryData[key].State === 'running' &&
          queryData[key].cpu &&
          queryData[key].memory
        ) {
          setLoadingScreen(false);
          activeContainers.push(queryData[key]);
        }
      }
    }
    setAllContainers(allContainers);
    setActiveContainers(activeContainers);
  }, [queryData]);

  return (
    <div className="App">
      {loadingScreen && (
        <>
          <div className="loadGauge">
            <LiquidGauge
              percent={0}
              width={500}
              height={500}
              label="LOADING METRICS..."
            />
          </div>
        </>
      )}
      {!loadingScreen && (
        <div className="main">
          <div className="left">
            <div className="title">
              <h1>Dockwell.</h1>
              <h2>A docker visualizer</h2>
              <div className="links">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  className="bi bi-house"
                  viewBox="0 0 16 16"
                >
                  <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5ZM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5 5 5Z" />
                </svg>
                <a href="https://dockwell.tech/" className="btn btn-link">
                  About
                </a>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  className="bi bi-github"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                </svg>
                <a
                  href="https://github.com/oslabs-beta/dockwell"
                  className="btn btn-link"
                >
                  GitHub   |    
                </a>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 256 279"
                  className="grafana"
                >
                  <defs>
                    <linearGradient
                      id="logosGrafana0"
                      x1="49.995%"
                      x2="49.995%"
                      y1="122.45%"
                      y2="31.139%"
                    >
                      <stop offset="0%" stop-color="#FFF100" />
                      <stop offset="100%" stop-color="#F05A28" />
                    </linearGradient>
                  </defs>
                  <path
                    fill="url(#logosGrafana0)"
                    d="M255.59 122.775c-.46-4.675-1.226-10.04-2.759-16.017a98.01 98.01 0 0 0-7.204-19.16a106.69 106.69 0 0 0-13.412-20.54c-2.222-2.681-4.675-5.287-7.28-7.816c3.908-15.558-4.752-29.046-4.752-29.046c-14.945-.92-24.448 4.675-27.973 7.204c-.613-.23-1.15-.537-1.763-.767c-2.529-.996-5.135-1.992-7.894-2.835a130.374 130.374 0 0 0-8.277-2.3c-2.835-.69-5.67-1.226-8.583-1.686c-.537-.076-.996-.153-1.533-.23C157.646 8.738 138.946 0 138.946 0c-20.922 13.258-24.831 31.805-24.831 31.805s-.077.383-.23 1.073c-1.15.307-2.299.69-3.449.996c-1.609.46-3.218 1.073-4.751 1.686a123.11 123.11 0 0 0-4.752 1.916a117.205 117.205 0 0 0-9.35 4.599c-2.989 1.686-5.9 3.525-8.737 5.441l-.766-.307c-28.97-11.036-54.643 2.223-54.643 2.223c-2.376 30.809 11.572 50.198 14.331 53.724c-.69 1.916-1.303 3.832-1.916 5.748c-2.146 6.974-3.755 14.101-4.751 21.535c-.154 1.073-.307 2.146-.384 3.219C7.894 146.916 0 173.97 0 173.97c22.302 25.674 48.359 27.283 48.359 27.283l.077-.076c3.295 5.9 7.127 11.495 11.419 16.783a111.904 111.904 0 0 0 5.671 6.362c-8.124 23.298 1.15 42.61 1.15 42.61c24.83.92 41.155-10.882 44.603-13.564a84.473 84.473 0 0 0 7.511 2.222a109.703 109.703 0 0 0 23.298 3.449c1.916.076 3.909.153 5.825.076h2.759l1.226-.076v.076c11.726 16.708 32.265 19.084 32.265 19.084c14.638-15.405 15.48-30.733 15.48-34.028v-1.38c3.066-2.145 5.979-4.445 8.738-6.974c5.824-5.288 10.959-11.342 15.25-17.857l1.15-1.839c16.554.92 28.28-10.27 28.28-10.27c-2.759-17.243-12.569-25.673-14.638-27.283c0 0-.077-.076-.23-.153c-.153-.077-.153-.153-.153-.153c-.077-.077-.23-.154-.383-.23c.076-1.073.153-2.07.23-3.142c.153-1.84.153-3.756.153-5.595v-2.913l-.077-1.149l-.076-1.533c0-.536-.077-.996-.154-1.456c-.076-.46-.076-.996-.153-1.456l-.153-1.456l-.23-1.456c-.307-1.916-.613-3.756-1.073-5.672c-1.763-7.433-4.675-14.484-8.43-20.845a70.373 70.373 0 0 0-14.025-16.707c-5.365-4.752-11.42-8.584-17.704-11.42c-6.36-2.835-12.952-4.675-19.543-5.518c-3.295-.46-6.59-.613-9.886-.536h-2.453l-1.226.077c-.46 0-.92.076-1.303.076a51.958 51.958 0 0 0-4.981.69c-6.591 1.226-12.799 3.602-18.24 6.897c-5.441 3.296-10.193 7.358-14.025 11.956a54.7 54.7 0 0 0-8.89 15.021a52.857 52.857 0 0 0-3.525 16.094c-.077 1.303-.077 2.683-.077 3.986v.996l.077 1.073c.076.613.076 1.303.153 1.916c.23 2.682.766 5.288 1.456 7.74c1.456 4.982 3.755 9.503 6.59 13.335c2.836 3.832 6.285 6.975 9.887 9.504c3.602 2.452 7.51 4.215 11.343 5.364c3.832 1.15 7.664 1.61 11.266 1.61h1.992c.23 0 .46 0 .689-.077c.383 0 .766-.077 1.15-.077c.076 0 .23 0 .306-.076l.383-.077c.23 0 .46-.076.69-.076c.46-.077.843-.154 1.303-.23c.46-.077.843-.154 1.226-.307c.843-.153 1.61-.46 2.376-.69c1.533-.536 3.066-1.15 4.368-1.839c1.38-.69 2.606-1.533 3.832-2.3c.307-.23.69-.459.997-.766c1.226-.996 1.456-2.835.46-4.061c-.844-1.073-2.376-1.38-3.603-.69l-.92.46a24.914 24.914 0 0 1-3.295 1.38c-1.15.382-2.375.689-3.602.919c-.613.076-1.226.153-1.916.23c-.306 0-.613.076-.996.076h-1.84c-.383 0-.766 0-1.149-.076h-.459c-.153 0-.383 0-.536-.077c-.383-.077-.69-.077-1.073-.153c-2.836-.383-5.671-1.226-8.354-2.453a29.275 29.275 0 0 1-7.74-5.058c-2.376-2.146-4.445-4.675-6.055-7.587c-1.61-2.912-2.759-6.131-3.295-9.503c-.23-1.686-.383-3.449-.307-5.135c0-.46.077-.92.077-1.38v-.613c0-.23.077-.46.077-.69c.076-.919.23-1.839.383-2.758c1.303-7.358 4.981-14.562 10.653-20.003c1.456-1.38 2.988-2.606 4.598-3.755a31.705 31.705 0 0 1 5.211-2.99a35.739 35.739 0 0 1 5.672-2.068c1.915-.537 3.908-.844 5.977-1.073c.997-.077 1.993-.154 3.066-.154h2.376l.843.077c2.222.153 4.368.46 6.514.996c4.292.92 8.507 2.53 12.415 4.675c7.818 4.369 14.485 11.113 18.547 19.237c2.07 4.061 3.525 8.43 4.215 12.951c.153 1.15.307 2.3.383 3.45l.077.842l.077.843v3.296c0 .536-.077 1.456-.077 1.992c-.077 1.227-.23 2.53-.383 3.756s-.383 2.452-.613 3.678a49.548 49.548 0 0 1-.843 3.602a64.129 64.129 0 0 1-2.3 7.128a62.417 62.417 0 0 1-7.204 13.105c-5.9 8.124-13.948 14.715-23.144 18.93c-4.599 2.069-9.427 3.602-14.408 4.368c-2.453.46-4.982.69-7.511.766h-3.832a36.08 36.08 0 0 1-4.062-.23c-5.365-.383-10.653-1.379-15.864-2.835c-5.135-1.456-10.116-3.525-14.868-5.978c-9.427-5.058-17.933-11.956-24.524-20.31a79.015 79.015 0 0 1-8.584-13.334a79.197 79.197 0 0 1-5.671-14.638c-1.38-5.058-2.223-10.193-2.606-15.405l-.077-.996v-6.821c.077-2.529.307-5.211.614-7.817c.306-2.606.766-5.288 1.302-7.894c.537-2.605 1.15-5.211 1.916-7.817a102.856 102.856 0 0 1 5.442-14.791c4.368-9.35 10.04-17.704 16.86-24.371c1.686-1.686 3.449-3.22 5.288-4.752a78.196 78.196 0 0 1 5.748-4.138c1.916-1.303 3.985-2.453 6.055-3.526a39.773 39.773 0 0 1 3.142-1.533a11118896.038 11118896.038 0 0 1 3.219-1.379c2.146-.92 4.368-1.686 6.667-2.376c.537-.153 1.15-.306 1.686-.536c.537-.154 1.15-.307 1.686-.46c1.15-.307 2.3-.613 3.45-.843c.536-.153 1.149-.23 1.762-.383c.613-.154 1.15-.23 1.763-.384c.613-.076 1.15-.23 1.762-.306l.843-.153l.92-.154c.613-.076 1.15-.153 1.763-.23c.69-.076 1.302-.153 1.992-.23c.537-.076 1.456-.153 1.993-.23c.383-.076.843-.076 1.226-.153l.843-.076l.383-.077h.46c.69-.077 1.303-.077 1.993-.153l.996-.077h.767c.536 0 1.149-.076 1.685-.076a98.944 98.944 0 0 1 6.745 0c4.445.153 8.813.69 13.028 1.456c8.507 1.61 16.478 4.291 23.758 7.893c7.28 3.526 13.719 7.894 19.39 12.646c.383.306.69.613 1.073.92c.306.306.69.613.996.92c.69.612 1.303 1.225 1.993 1.838c.69.614 1.303 1.227 1.916 1.84a44.302 44.302 0 0 1 1.839 1.916c2.376 2.529 4.598 5.058 6.59 7.664a98.897 98.897 0 0 1 9.734 15.25l.46.92l.46.92c.306.613.613 1.226.843 1.84c.306.613.536 1.149.843 1.762c.23.613.536 1.15.766 1.763c.92 2.299 1.84 4.521 2.53 6.59c1.149 3.373 1.992 6.362 2.682 8.967a2.043 2.043 0 0 0 2.299 1.61c1.15-.077 1.992-.996 1.992-2.146c.077-2.759 0-6.054-.383-9.81Z"
                  />
                </svg>
                <a
                  href="http://localhost:3000/"
                  className="btn btn-link grafana"
                >
                  Grafana
                </a>
              </div>
            </div>
            <SystemMetrics
              totals={queryData.totals}
              activeContainers={activeContainers}
            />
          </div>
          <div className="middle">
            <div className="CarouselDiv">
              <Carousel
                className="carousel"
                activeContainers={activeContainers}
              />
            </div>
          </div>
          <div className="right">
            <Environments />
            <div className="logs">
              <Logs
                classname="logs-container"
                activeContainers={activeContainers}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
