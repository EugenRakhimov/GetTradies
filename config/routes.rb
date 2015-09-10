Rails.application.routes.draw do

  root "jobs#index"
  resources :jobs do
    resources :tenders, only: [:index, :create, :update]
    resources :ratings, only: [:create, :new]
  end
  resources :sessions, only: [:index, :create, :destroy]
  resources :users do
    resources :tenders, only: [:index, :create, :update]
    resources :jobs, only: [:index, :show]
  end
  resources :tenders, only: [:index, :create, :update]
end
