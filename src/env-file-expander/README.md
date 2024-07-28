# EnvFileExpander

### Description:

The EnvFileExpander builder is a powerful tool designed for Angular projects to dynamically expand environment variables
within configuration files. By using this builder, you can seamlessly replace placeholders in source files with actual
environment variable values, and generate updated files at specified target locations.

### Features:

- **Dynamic Variable Expansion:** Automatically expand environment variables within your configuration files, allowing
  for flexible and environment-specific settings.
- **Flexible File Mapping:** Supports an array of file mappings, enabling you to specify multiple source and target
  paths for processing.
- **Easy Integration:** Integrate effortlessly with Angular projects to enhance configuration management and deployment
  workflows.
- **Customizable:** Configure file patterns and paths to suit your project's needs, ensuring that environment variables
  are injected correctly into your files.

### Usage:

- Specify File Mappings: Provide an array of objects where each object defines a source file with placeholders and a
  target file where the expanded content will be written.
- Process Files: The builder reads the source files, replaces placeholders with corresponding environment variable
  values, and writes the resulting content to the target files.

#### Example Configuration:

angular.json file

```json
{
  "projects": {
    "some-project-name": {
      "architect": {
        "env-file-expand": {
          "builder": "@andresandoval/angular-devkit-builders:env-file-expander",
          "options": {
            "files": [
              {
                "source": "src/config.template.json",
                "target": "dist/config.json"
              },
              {
                "source": "src/another.template.config",
                "target": "dist/another.config"
              }
            ]
          }
        }
      }
    }
  }
}
```

In this example, config.template.json and another.template.config will have their placeholders replaced with environment
variables, and the processed content will be saved as config.json and another.config respectively in the dist directory.

run it by:

```bash
ng run some-project-name:env-file-expand
```