class JobsController < ApplicationController

  def index
    @current_user = User.find_by_id(session[:user_id])
    @user_id = params[:user_id]
    @personal_list = false
    if params[:search]
      @jobs = Job.search(params[:search])
    elsif params[:user_id]
      @personal_list = true
      @jobs = Job.where(user_id: params[:user_id])
    else
      @jobs = Job.where(completed: false)
    end
    render json: @jobs
  end

  def show
    @current_user = User.find_by_id(session[:user_id])
    @job = Job.find(params[:id])
    @accepted_tender = Tender.where(job_id: @job.id, accepted: true).first
    accepted_tradie = if @accepted_tender
      { username: @accepted_tender.user.username,
        email: @accepted_tender.user.email,
        phone: @accepted_tender.user.phone_number,
        id: @accepted_tender.user.id
      }
    else
      nil
    end
    @tenders = Tender.where(job_id: @job.id, accepted: false)
    tradies = []
    @tenders.each do |tender|
      tradie = {}
      tradie[:name] = tender.user.username if tender.user.username
      tradie[:photo] = tender.user.image_file_name if tender.user.image_file_name
      tradie[:id] = tender.user_id
      tradie[:tender_id] = tender.id
      tradies << tradie
    end
    @tender_changeable = true
    if @accepted_tender
      @tender_changeable = false if @accepted_tender.updated_at > 30.seconds.ago
    end
    @job_complete = false
    if Tender.where(job_id: @job.id, rating: nil).length < Tender.where(job_id: @job.id).length
      @job_complete = true
    end
    @job_complete = false if Tender.where(job_id: @job.id).length == 0
    # render text: @tenders.length
    hash_for_job_show={job:@job,accepted_tradie: accepted_tradie,tradies: tradies,
      job_complete:@job_complete, image:@job.image.url(:medium)}
    render json: hash_for_job_show
  end

  def new
    @job = Job.new
  end

  def create
    p "angular hits this route"
    puts user_id = session[:user_id]
    if session[:user_id]
      @job = Job.create(create_job_params)
      @job.update(:user_id => user_id)
      render json: {notice:"Job created"} 
    else
      render json: {alert: "Please log-in if you'd like to post a job"} , status: :unauthorized
    end

  end
  def destroy
    @current_user = User.find_by_id(session[:user_id])
    job = Job.find_by_id(params[:id])
    # p @current_user
    # p params
    if @current_user && job
      if (@current_user == job.user)
        job.destroy
        render json: {notice:"Job deleted"} 
      else
        render json: {alert: "You are trying delete others job"} , status: :forbidden
      end
    else
      render json: {alert: "You should be logged in to delete jobs"} , status: :unauthorized
    end
  end


  private

  def create_job_params
    params.require(:job).permit(:title, :location, :description, :image)
  end

end


