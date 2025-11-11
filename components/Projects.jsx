import React from 'react';

const Projects = ({ projects = [] }) => {

  const safeProjects = Array.isArray(projects) ? projects : [];
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {safeProjects.map((project) => (
          <div key={project.id || Math.random()} className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-lg text-gray-800">{project.name || 'Unnamed Project'}</h3>
            <p className="text-gray-600 text-sm mt-2">{project.description || 'No description available'}</p>
            
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progress</span>
                <span>{project.progress || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${project.progress || 0}%` }}
                ></div>
              </div>
            </div>
            
            <div className="mt-4 flex justify-between text-sm text-gray-500">
              <span>Status: {project.status || 'Unknown'}</span>
              <span>Due: {project.deadline || 'N/A'}</span>
            </div>

            
            <div className="mt-3 text-xs text-gray-500">
              Tasks: {(project.completed || 0)}/{(project.total || 0)} completed
            </div>
          </div>
        ))}
      </div>
      
      {safeProjects.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No projects available
        </div>
      )}
    </div>
  );
};

export default Projects;